export const BATCH_INTERVAL = 5 * 1000; // 5 seconds
export type MessageType = "TEXT" | "IMAGE" | "FILE" | "AUDIO" | "VIDEO";

export type SendMessageType = {
  senderId: string;
  targetId?: string | undefined;
  conversationId?: string | undefined;
  content: string;
  type?: MessageType;
  file_name?: string;
  mime_type?: string; 
  file_size?: number;
};
