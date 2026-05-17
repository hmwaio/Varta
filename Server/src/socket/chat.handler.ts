import { Server, Socket } from "socket.io";
import { prisma } from "../lib/prisma.lib.js";
import { redis } from "../lib/redis.lib.js";
import { sendMessage } from "../services/messages/sendMessage.service.js";
import type { MessageType } from "../types/message.type.js";
import { resolveUserId } from "../utils/resolveUser.js";

export const registerChatHandlers = (
  io: Server,
  socket: Socket & { userId: string },
) => {
  const userId = socket.userId;

  // ─── Presence ───────────────────────────────────────────────
  const initializePresence = async () => {
    const socketKey = `user:sockets:${userId}`;

    // Track socket
    await redis.sadd(socketKey, socket.id);

    // Mark online
    await redis.set(`presence:${userId}`, "online");

    socket.join(`user:${userId}`);

    // Notify others
    io.emit("user:status", { userId, status: "online" });
  };
  initializePresence().catch((err) => {
    console.error("Presence init failed", err);
    socket.disconnect(true);
  });

  socket.on("presence:request", async (targetUserId: string) => {
    try {
      const presence = await redis.get(`presence:${targetUserId}`);
      const lastSeen = await redis.get(`last_seen:${targetUserId}`);
      socket.emit("user:status", {
        userId: targetUserId,
        status: presence === "online" ? "online" : "offline",
        lastSeen: lastSeen ?? null,
      });
    } catch (err) {
      console.error("presence:request error", err);
    }
  });

  // ─── Rooms ──────────────────────────────────────────────────
  socket.on("conversation:join", async (conversationId: string) => {
    try {
      socket.join(conversationId);
      // Notify others in room
      socket.to(conversationId).emit("conversation:user_joined", {
        userId,
        conversationId,
      });
    } catch (err) {
      console.error("conversation:join error", err);
    }
  });

  socket.on("conversation:leave", async (conversationId: string) => {
    try {
      socket.leave(conversationId);
      socket.to(conversationId).emit("conversation:user_left", {
        userId,
        conversationId,
      });
    } catch (err) {
      console.error("conversation:leave error", err);
    }
  });

  // ─── Messaging ───────────────────────────────────────────────
  socket.on(
    "message:send",
    async (
      data: {
        targetId?: string;
        conversationId?: string;
        content: string;
        type: MessageType;
        file_name?: string;
        mime_type?: string;
        file_size?: number;
      },
      ack?: (response: any) => void,
    ) => {
      try {
        const message = await sendMessage({
          senderId: userId,
          targetId: data.targetId,
          conversationId: data.conversationId,
          content: data.content,
          type: data.type,
          ...(data.file_name != null && { file_name: data.file_name }),
          ...(data.mime_type != null && { mime_type: data.mime_type }),
          ...(data.file_size != null && { file_size: data.file_size }),
        });

        /* ───────── GROUP MESSAGE ───────── */
        if (message.conversation_id) {
          io.to(message.conversation_id).emit("message:new", message);
        }

        /* ───────── DIRECT MESSAGE ───────── */
        if (data.targetId) {
          try {
            const resolvedTargetId = await resolveUserId(data.targetId?.trim());

            // Avoid duplicate emit on self-message
            if (resolvedTargetId !== userId) {
              io.to(`user:${resolvedTargetId}`).emit("message:new", message);
            }
          } catch (err) {
            console.error("resolveUserId error", err);
          }
        }

        /* ───────── SENDER SYNC (ONLY FOR DM, NOT GROUP DUPLICATE) ───────── */
        if (!message.conversation_id) {
          io.to(`user:${userId}`).emit("message:new", message);
        }

        ack?.({
          success: true,
          message,
        });
      } catch (err: any) {
        ack?.({
          success: false,
          error: err.message || "Failed to send message.",
        });
      }
    },
  );

  // ─── Message Delivered ────────────────────────────────────────────
  socket.on(
    "message:delivered",
    async ({
      messageId,
      targetUserId,
    }: {
      messageId: string;
      targetUserId: string;
    }) => {
      try {
        io.to(`user:${targetUserId}`).emit("message:delivered", { messageId });
      } catch (err) {
        console.error("message:delivered error", err);
      }
    },
  );

  // ─── Read Receipt ────────────────────────────────────────────
  socket.on(
    "message:read",
    async (data: {
      messageId: string;
      conversationId: string;
      targetUserId?: string;
    }) => {
      try {
        const messageExists = await prisma.message.findUnique({
          where: { message_id: data.messageId },
          select: { message_id: true },
        });
        if (!messageExists) return;

        const payload = {
          conversation_id: data.conversationId,
          messageId: data.messageId,
          userId,
          seenAt: new Date().toISOString(),
        };

        await prisma.messageRead.upsert({
          where: {
            message_id_user_id: { message_id: data.messageId, user_id: userId },
          },
          create: { message_id: data.messageId, user_id: userId },
          update: { read_at: new Date() },
        });

        // Emit to room
        io.to(data.conversationId).emit("message:seen", payload);

        // Optional direct emit
        if (data.targetUserId) {
          io.to(`user:${data.targetUserId}`).emit("message:seen", payload);
        }
      } catch (err) {
        console.error("message:read error", err);
      }
    },
  );

  // ─── Typing ──────────────────────────────────────────────────
  socket.on("typing:start", async (conversationId: string) => {
    try {
      const key = `typing:${userId}:${conversationId}`;
      const already = await redis.get(key);
      if (already) return;
      await redis.set(key, "1");
      socket
        .to(conversationId)
        .emit("typing:update", { userId, isTyping: true });
    } catch (err) {
      console.error("typing:start error", err);
    }
  });

  socket.on("typing:stop", (conversationId: string) => {
    try {
      socket.to(conversationId).emit("typing:update", {
        userId,
        isTyping: false,
      });
    } catch (err) {
      console.error("typing:stop error", err);
    }
  });

  // ─── Disconnect ──────────────────────────────────────────────
  socket.on("disconnect", async () => {
    try {
      const socketKey = `user:sockets:${userId}`;
      // Remove disconnected socket
      await redis.srem(socketKey, socket.id);
      // Remaining active sockets
      const remainingSockets = await redis.scard(socketKey);
      // User still active elsewhere
      if (remainingSockets > 0) return;

      await redis.del(socketKey);
      await redis.set(`presence:${userId}`, "offline");

      const lastSeen = new Date().toISOString();
      await redis.set(`last_seen:${userId}`, lastSeen);

      io.emit("user:status", {
        userId,
        status: "offline",
        lastSeen,
      });
    } catch (error) {
      console.error("disconnect error", error);
    }
  });
};
