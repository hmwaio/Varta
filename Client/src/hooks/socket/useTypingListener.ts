import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";

export const useTypingListener = (roomId?: string) => {
  const socket = useSocket();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket || !roomId) return;

    const handleTyping = ({
      userId,
      isTyping,
    }: {
      userId: string;
      isTyping: boolean;
    }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          if (prev.includes(userId)) return prev;
          return [...prev, userId];
        }
        return prev.filter((id) => id !== userId);
      });
    };
    socket.on("typing:update", handleTyping);
    return () => {
      socket.off("typing:update", handleTyping);
    };
  }, [socket, roomId]);

  return {
    typingUsers,
  };
};
