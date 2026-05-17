import { useMemo, type Dispatch, type SetStateAction } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import { getSocket } from "../../lib/socket";
import type { Message } from "../../types/message.type";

export const useSendMessage = (
  content: string,
  setContent: Dispatch<SetStateAction<string>>,
  setMessages: Dispatch<SetStateAction<Message[]>>,
) => {
  const { user } = useAuth();
  const socket = useMemo(() => getSocket(), []);
  const { targetId } = useParams<{
    targetId: string;
  }>();

  /* Send message */
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || !targetId || !socket || !user) {
      return;
    }

    const optimistic: Message = {
      message_id: crypto.randomUUID(),
      sender_id: user.user_id,
      sender_name: user.name,
      sender_picture: null,
      content,
      type: "TEXT",
      created_at: new Date().toISOString(),
      status: "sending",
      conversation_id: "",
    };

    /* Optimistic UI */
    setMessages((prev) => [...prev, optimistic]);
    setContent("");
    socket.emit(
      "message:send",
      {
        targetId,
        content,
        type: "TEXT",
      },
      (ack: any) => {
        if (ack?.success) {
          setMessages((prev) =>
            prev.map((m) =>
              m.message_id === optimistic.message_id
                ? {
                    ...m,
                    message_id: ack.message?.message_id ?? m.message_id,
                    conversation_id: ack.message?.conversation_id,
                    status: "sent",
                  }
                : m,
            ),
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.message_id === optimistic.message_id
                ? {
                    ...m,
                    status: "failed",
                  }
                : m,
            ),
          );
        }
      },
    );
  };

  return sendMessage;
};
