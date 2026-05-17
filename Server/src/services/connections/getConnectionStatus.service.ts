import { prisma } from "../../lib/prisma.lib.js";
import { resolveUserId } from "../../utils/resolveUser.js";

type GetConnectionStatusData = {
  userId: string;
  targetId: string;
};

export const getConnectionStatus = async (data: GetConnectionStatusData) => {
  const userId = await resolveUserId(data.userId);
  const targetId = await resolveUserId(data.targetId);

  const connectionStatus = await prisma.connection.findFirst({
    where: {
      OR: [
        { sender_id: userId, receiver_id: targetId },
        { sender_id: targetId, receiver_id: userId },
      ],
    },
  });
  if (connectionStatus) return { status: connectionStatus.status };

  const request = await prisma.connectionRequest.findFirst({
    where: {
      OR: [
        { sender_id: userId, receiver_id: targetId },
        { sender_id: targetId, receiver_id: userId },
      ],
    },
  });

  if (request) return { status: "PENDING" };
  return { status: "NONE" };
};
