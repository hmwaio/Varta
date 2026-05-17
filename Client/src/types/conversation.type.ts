export type Conversation = {
  conversation_id: string;
  unreadCount: number;
  participants: {
    user: {
      username: string;
      name: string;
      is_deleted: boolean;
      profile: { profile_picture: string | null } | null;
    };
  }[];
  messages: {
    content: string | null;
    created_at: string;
  }[];
};