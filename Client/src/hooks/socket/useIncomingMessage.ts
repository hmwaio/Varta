import { useEffect } from "react";
import { useAuth } from "../../context/Auth";
import { useSocket } from "./useSocket";
import type { Message } from "../../types/message.type";

export const useIncomingMessages = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  scrollToBottom: () => void,
  roomId?: string,
) => {
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket) return;

    const handle = (msg: Message) => {
      if (roomId && msg.conversation_id && msg.conversation_id !== roomId) return;

      setMessages((prev) => {
        if (prev.some((m) => m.message_id === msg.message_id)) return prev;

        const optimisticIndex = prev.findIndex(
          (m) => m.status === "sending" && m.sender_id === msg.sender_id && m.content === msg.content,
        );
        if (optimisticIndex !== -1) {
          const updated = [...prev];
          updated[optimisticIndex] = { ...msg, status: "sent" };
          return updated;
        }

        return [...prev, msg];
      });

      scrollToBottom();

      // only emit delivered if message is from someone else
      if (msg.sender_id !== user?.user_id) {
        socket.emit("message:delivered", {
          messageId: msg.message_id,
          targetUserId: msg.sender_id,
        });
      }
    };

    socket.on("message:new", handle);
    return () => socket.off("message:new", handle);
  }, [socket, roomId, setMessages, scrollToBottom, user?.user_id]);
};