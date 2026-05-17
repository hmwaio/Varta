import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import type { Message } from "../../types/message.type";
import type { User } from "../../types/user.type";

interface Props {
  messages: Message[];
  socket: Socket | null;
  user: User | null;
  targetUserId?: string; // add this
}

export const useReadMessages = ({ messages, socket, user, targetUserId }: Props) => {
  useEffect(() => {
    if (!messages.length || !socket || !user) return;

    messages.forEach((msg) => {
      if (msg.sender_id !== user.user_id && msg.status !== "seen" && !msg.isRead) {
        socket.emit("message:read", {
          messageId: msg.message_id,
          conversationId: msg.conversation_id,
          targetUserId: msg.sender_id ?? targetUserId, // fallback
        });
      }
    });
  }, [messages, socket, targetUserId, user]);
};
