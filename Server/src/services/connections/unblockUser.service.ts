// unblockUser.service.ts
import { prisma } from "../../lib/prisma.lib.js";
import { resolveUserId } from "../../utils/resolveUser.js";

export const unblockUser = async (data: { blockerId: string; blockedId: string }) => {
  const blockerId = await resolveUserId(data.blockerId);
  const blockedId = await resolveUserId(data.blockedId);

  // Only the person who blocked can unblock
  const blocked = await prisma.connection.findFirst({
    where: {
      sender_id: blockerId,
      receiver_id: blockedId,
      status: "BLOCKED",
    },
  });

  if (!blocked) throw new Error("No block found or you didn't block this user.");

  // Restore to CONNECTED
  await prisma.connection.update({
    where: { connection_id: blocked.connection_id },
    data: { status: "CONNECTED" },
  });

  return { message: "User unblocked." };
};