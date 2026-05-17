import { prisma } from "../../lib/prisma.lib.js";
import { redis } from "../../lib/redis.lib.js";
import { resolveUserId } from "../../utils/resolveUser.js";

type GetMessageType = {
  userId: string;
  targetId?: string | undefined; // for dm
  conversationId?: string | undefined; // for group
  cursor?: string | undefined;
  direction?: "older" | "newer" | undefined;
};
const PAGE_LIMIT = 30;
export const getMessage = async (data: GetMessageType) => {
  const { userId, targetId, cursor, direction } = data;
  let { conversationId } = data;

  // DM — find conversation by targetId
  if (!conversationId && targetId) {
    const resolvedId = await resolveUserId(targetId);
    const conversation = await prisma.conversation.findFirst({
      where: {
        type: "DIRECT",
        AND: [
          { participants: { some: { user_id: userId } } },
          { participants: { some: { user_id: resolvedId } } },
        ],
      },
    });
    if (!conversation) throw new Error("No conversation found.");
    conversationId = conversation.conversation_id;
  }

  if (!conversationId) {
    if (!targetId) throw new Error("targetId or conversationId required.");
    throw new Error("No conversation found.");
  }

  const isMember = await prisma.conversationMember.findUnique({
    where: {
      conversation_id_user_id: {
        conversation_id: conversationId,
        user_id: userId,
      },
    },
  });

  if (!isMember) throw new Error("You are not a member of this conversation.");

  if (!cursor) {
    const buffered = await redis.lrange(
      `chat:buffer:${conversationId}`,
      0,
      PAGE_LIMIT - 1,
    );
    if (buffered.length > 0) {
      const messages = buffered.map((m) => ({ ...JSON.parse(m), isRead: false }));

      // Sort oldest → newest
      messages.sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );

      return { messages, nextCursor: null, source: "cache" };
    }
  }

  let cursorCondition = {};

  if (cursor) {
    const cursorMessage = await prisma.message.findUnique({
      where: { message_id: cursor },
      select: { created_at: true },
    });

    if (cursorMessage) {
      cursorCondition = {
        created_at:
          direction === "older"
            ? { lt: cursorMessage.created_at }
            : { gt: cursorMessage.created_at },
      };
    }
  }

  const messages = await prisma.message.findMany({
    where: {
      conversation_id: conversationId,
      is_deleted: false,
      ...cursorCondition,
    },
    orderBy: { created_at: direction === "older" ? "desc" : "asc" },
    take: PAGE_LIMIT + 1,
    include: {
      read_by: {
        where: { user_id: userId },
        select: { read_id: true },
      },
    },
  });

  const hasMore = messages.length > PAGE_LIMIT;
  if (hasMore) messages.pop();

  // Return oldest → newest for display
  if (direction === "older") messages.reverse();

  const nextCursor = hasMore ? (messages[0]?.message_id ?? null) : null;

  const mapped = messages.map((m: { read_by: string | any[]; }) => ({
    ...m,
    isRead: m.read_by.length > 0,
  }));

  return { messages: mapped, nextCursor, hasMore, source: "db" };
};
