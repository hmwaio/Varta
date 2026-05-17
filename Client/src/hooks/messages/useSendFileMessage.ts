import type { Dispatch, SetStateAction } from "react";
import { useAuth } from "../../context/Auth";
import { getSocket } from "../../lib/socket";
import type { Message, SendFileType } from "../../types/message.type";

interface SendFileMessageProps {
  targetId?: string;
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

export const useSendFileMessage = ({
  targetId,
  setMessages,
}: SendFileMessageProps) => {
  const socket = getSocket();
  const { user } = useAuth();

  const sendFileMessage = (
    fileUrl: string,
    fileType: SendFileType,
    fileName: string,
    mimeType: string,
    fileSize: number,
  ) => {
    if (!socket || !targetId || !user) {
      return;
    }

    const optimisticId = crypto.randomUUID();
    const optimistic: Message = {
      message_id: optimisticId,
      conversation_id: "",
      sender_id: user.user_id,
      sender_name: user.name,
      sender_picture: null,
      content: fileUrl,
      type: fileType,
      file_name: fileName,
      mime_type: mimeType,
      file_size: fileSize,
      created_at: new Date().toISOString(),
      status: "sending",
    };

    /* Optimistic UI */
    setMessages((prev) => [...prev, optimistic]);

    socket.emit(
      "message:send",
      {
        targetId,
        content: fileUrl,
        type: fileType,
        file_name: fileName,
        mime_type: mimeType,
        file_size: fileSize,
      },

      (ack: { success: boolean; message?: Message; error?: string }) => {
        if (ack?.success && ack.message) {
          setMessages((prev) =>
            prev.map((m) =>
              m.message_id === optimisticId
                ? {
                    ...m,
                    message_id: ack.message!.message_id,
                    conversation_id: ack.message!.conversation_id,
                    status: "sent",
                  }
                : m,
            ),
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.message_id === optimisticId
                ? {
                    ...m,
                    status: "failed",
                  }
                : m,
            ),
          );
          console.error(ack?.error || "Failed to send file message.");
        }
      },
    );
  };

  return {
    sendFileMessage,
  };
};
