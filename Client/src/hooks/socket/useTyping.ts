import { useRef } from "react";
import { useSocket } from "./useSocket";

export const useTyping = (roomId?: string) => {
  const socket = useSocket();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTyping = () => {
    if (!socket || !roomId) return;
    socket.emit("typing:start", roomId);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", roomId);
    }, 1500);
  };

  const stopTyping = () => {
    if (!socket || !roomId) return;
    socket.emit("typing:stop", roomId);
  };

  return {
    startTyping,
    stopTyping,
  };
};
