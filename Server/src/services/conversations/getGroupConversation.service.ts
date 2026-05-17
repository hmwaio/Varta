import { prisma } from "../../lib/prisma.lib.js";

type GetConversationType = {
  userId: string;
};

export const getConversation = async (data: GetConversationType) => {
  const { userId } = data;

  /* Check DM already exist */
  const conversation = await prisma.conversation.findMany({
    where: {
      type: "GROUP",
      participants: { some: { user_id: userId } },
    },
    include: {
      _count: { select: { participants: true } },
      messages: {
        orderBy: { created_at: "desc" },
        take: 1,
      },
    },
    orderBy: { updated_at: "desc" },
  });

  if (!conversation) throw new Error("Conversation not found");
  return conversation.map((c: any) => ({
    conversation_id: c.conversation_id,
    name: c.name,
    member_count: c._count.participants,
    last_message: c.messages[0] ?? null,
    updated_at: c.updated_at,
  }));
};
