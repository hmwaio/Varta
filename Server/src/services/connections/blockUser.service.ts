import { prisma } from "../../lib/prisma.lib.js";
import { resolveUserId } from "../../utils/resolveUser.js";

type BlockUserData = {
  blockerId: string;
  blockedId: string;
};

export const blockUser = async (data: BlockUserData) => {
  const blockerId = await resolveUserId(data.blockerId);
  const blockedId = await resolveUserId(data.blockedId);

  if (blockerId === blockedId) throw new Error("Invalid request");

  const existingConnection = await prisma.connection.findFirst({
    where: {
      OR: [
        { sender_id: blockerId, receiver_id: blockedId },
        { sender_id: blockedId, receiver_id: blockerId },
      ],
    },
  });

  if (existingConnection) {
    await prisma.connection.update({
      where: { connection_id: existingConnection.connection_id },
      data: { status: "BLOCKED" },
    });
  } else {
    /* No connection exist - Create one as BLOCKED */
    await prisma.connection.create({
      data: { sender_id: blockerId, receiver_id: blockedId, status: "BLOCKED" },
    });
  }

  await prisma.connectionRequest.deleteMany({
    where: {
      OR: [
        { sender_id: blockerId, receiver_id: blockedId },
        { sender_id: blockedId, receiver_id: blockerId },
      ],
    },
  });

  return { message: "User blocked" };
};
