import { useEffect } from "react";
import { useSocket } from "./useSocket";

export const useConversationRoom = (conversationId?: string) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("conversation:join", conversationId);

    return () => {
      socket.emit("conversation:leave", conversationId);
    };
  }, [conversationId, socket]);
};
