import { prisma } from "../../lib/prisma.lib.js";

type GetUnreadCountType = {
  userId: string;
  conversationId: string;
};

export const unreadCount = async (data: GetUnreadCountType) => {
  const { userId, conversationId } = data;

  const messageCount = await prisma.message.count({
    where: {
      conversation_id: conversationId,
      sender_id: { not: userId },
      is_deleted: false,
      read_by: {
        none: { user_id: userId },
      },
    },
  });
  return { conversationId, unread_count: messageCount };
};
