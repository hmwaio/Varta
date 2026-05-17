import { prisma } from "../../lib/prisma.lib.js";
import { redis } from "../../lib/redis.lib.js";

export const getDirectConversations = async (data: { userId: string }) => {
  const { userId } = data;

  const conversations = await prisma.conversation.findMany({
    where: {
      type: "DIRECT",
      participants: { some: { user_id: userId } },
    },
    include: {
      messages: {
        orderBy: { created_at: "desc" },
        take: 1,
      },
      participants: {
        where: { user_id: { not: userId } },
        include: {
          user: {
            select: {
              username: true,
              name: true,
              is_deleted: true,
              profile: { select: { profile_picture: true } },
            },
          },
        },
      },
      _count: {
        select: {
          messages: {
            where: {
              sender_id: { not: userId },
              read_by: { none: { user_id: userId } },
            },
          },
        },
      },
    },
    orderBy: { updated_at: "desc" },
  });

  const enriched = await Promise.all(
    conversations.map(async (conv: any) => {
      const buffered = await redis.lrange(
        `chat:buffer:${conv.conversation_id}`,
        0,
        0,
      );

      let lastMessage = conv.messages[0]
        ? {
            content: conv.messages[0].content,
            created_at: conv.messages[0].created_at.toISOString(),
          }
        : null;

      // Safe extraction
      const [latestBuffered] = buffered;

      if (latestBuffered) {
        const bufferedMsg: {
          content: string;
          created_at: string;
        } = JSON.parse(latestBuffered);

        if (
          !lastMessage ||
          new Date(bufferedMsg.created_at) > new Date(lastMessage.created_at)
        ) {
          lastMessage = {
            content: bufferedMsg.content,
            created_at: bufferedMsg.created_at,
          };
        }
      }

      return {
        conversation_id: conv.conversation_id,
        participants: conv.participants,
        messages: lastMessage ? [lastMessage] : [],
        unreadCount: conv._count.messages,
      };
    }),
  );

  return enriched.sort((a: any, b: any) => {
    const aTime = a.messages[0]?.created_at ?? "";
    const bTime = b.messages[0]?.created_at ?? "";
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });
};
