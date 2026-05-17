
export type MessageStatusType = "sending" | "sent" | "delivered" | "seen" | "failed";
export type SendFileType = "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
export type SendMessageType = "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";

export interface Message {
  message_id: string;
  conversation_id?: string;
  sender_id: string;
  sender_name: string;
  sender_picture: string | null;
  content: string;
  type: SendMessageType
  created_at: string;
  status?: MessageStatusType;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
  isRead?: boolean;
}


