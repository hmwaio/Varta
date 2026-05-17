import { prisma } from "../../lib/prisma.lib.js";
import { resolveUserId } from "../../utils/resolveUser.js";

type DirectConversationType = {
  userId: string;
  targetId: string;
};

export const MESSAGE_REQUEST_LIMIT = 1;
export const getMessageRequestKey = (userId: string, targetId: string) => {
  const sorted = [userId, targetId].sort();
  return `msg_request:${sorted[0]}:${sorted[1]}`;
};

export const createDirectConversation = async (
  data: DirectConversationType,
) => {
  const { userId, targetId } = data;
  const resolvedTargetId = await resolveUserId(targetId);

  /* Check DM already exist */
  const existing = await prisma.conversation.findFirst({
    where: {
      type: "DIRECT",
      AND: [
        { participants: { some: { user_id: userId } } },
        { participants: { some: { user_id: resolvedTargetId } } },
      ],
    },
    select: { conversation_id: true },
  });

  if (existing) return existing;

  const connectionStatus = await prisma.connection.findFirst({
    where: {
      OR: [
        { sender_id: userId, receiver_id: resolvedTargetId },
        { sender_id: resolvedTargetId, receiver_id: userId },
      ],
      status: "CONNECTED",
    },
  });

  const isRequest = !connectionStatus;

  /* Create conversation add both members */
  const createConversation = await prisma.conversation.create({
    data: {
      type: "DIRECT",
      is_request: isRequest,
      created_by: userId,
      participants: {
        create: [{ user_id: userId }, { user_id: resolvedTargetId }],
      },
    },
    include: { participants: true },
  });
  return createConversation;
};
