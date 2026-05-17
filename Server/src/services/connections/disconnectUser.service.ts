import { prisma } from "../../lib/prisma.lib.js";
import { resolveUserId } from "../../utils/resolveUser.js";

export const disconnectUser = async (data: {
  userId: string;
  targetId: string;
}) => {
  const userId = await resolveUserId(data.userId);
  const targetId = await resolveUserId(data.targetId);

  await prisma.connection.deleteMany({
    where: {
      OR: [
        { sender_id: userId, receiver_id: targetId },
        { sender_id: targetId, receiver_id: userId },
      ],
      status: "CONNECTED",
    },
  });

  // Reset conversation is_request back to true
  await prisma.conversation.updateMany({
    where: {
      type: "DIRECT",
      is_request: false,
      AND: [
        { participants: { some: { user_id: userId } } },
        { participants: { some: { user_id: targetId } } },
      ],
    },
    data: { is_request: true },
  });

  return { message: "Disconnected." };
};
