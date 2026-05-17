import { useEffect } from "react";
import type { Message } from "../../types/message.type";
import { useSocket } from "./useSocket";

export const useMessageStatus = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleDelivered = ({ messageId }: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.message_id === messageId && m.status === "sent"
            ? { ...m, status: "delivered" }
            : m,
        ),
      );
    };

    const handleSeen = ({ messageId }: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.message_id === messageId ? { ...m, status: "seen" } : m,
        ),
      );
    };

    socket.on("message:delivered", handleDelivered);
    socket.on("message:seen", handleSeen);

    return () => {
      socket.off("message:delivered", handleDelivered);
      socket.off("message:seen", handleSeen);
    };
  }, [socket, setMessages]);
};
