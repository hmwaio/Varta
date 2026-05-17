import { Server, Socket } from "socket.io";
import { resolveUserId } from "../utils/resolveUser.js";

export const registerCallHandlers = (
  io: Server,
  socket: Socket & { userId: string },
) => {
  socket.on("call:initiate", async ({ targetId, type }) => {
    try {
      const resolvedId = await resolveUserId(targetId);
      io.to(`user:${resolvedId}`).emit("call:incoming", {
        callerId: socket.userId,
        type,
      });
    } catch (err) {
      console.error("call:initiate resolve error", err);
    }
  });

  socket.on("call:offer", async ({ targetId, offer, type }) => {
    try {
      const resolvedId = await resolveUserId(targetId);
      io.to(`user:${resolvedId}`).emit("call:offer", {
        callerId: socket.userId,
        offer,
        type,
      });
    } catch (err) {
      console.error("call:offer error", err);
    }
  });

  socket.on("call:answer", async ({ targetId, answer }) => {
    try {
      const resolvedId = await resolveUserId(targetId);
      io.to(`user:${resolvedId}`).emit("call:answer", {
        calleeId: socket.userId,
        answer,
      });
    } catch (err) {}
  });

  socket.on("call:candidate", async ({ targetId, candidate }) => {
    try {
      const resolvedId = await resolveUserId(targetId);
      io.to(`user:${resolvedId}`).emit("call:candidate", {
        fromId: socket.userId,
        candidate,
      });
    } catch (err) {}
  });

  socket.on("call:end", async ({ targetId }) => {
    try {
      const resolvedId = await resolveUserId(targetId);
      io.to(`user:${resolvedId}`).emit("call:ended", { fromId: socket.userId });
    } catch (err) {}
  });

  socket.on("call:reject", async ({ targetId }) => {
    try {
      const resolvedId = await resolveUserId(targetId);
      io.to(`user:${resolvedId}`).emit("call:rejected", {
        fromId: socket.userId,
      });
    } catch (err) {}
  });
};
