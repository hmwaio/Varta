import { prisma } from "../../lib/prisma.lib.js";

type GetPendingRequestData = {
  userId: string;
};

export const getPendingRequest = async (data: GetPendingRequestData) => {
  const { userId } = data;

  const pendingRequest = await prisma.connectionRequest.findMany({
    where: { receiver_id: userId },
    include: {
      sender: {
        select: {
          user_id: true,
          name: true,
          username: true,
          profile: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return pendingRequest.map((r: any) => ({
    request_id: r.request_id,
    intro_message: r.intro_message,
    created_at: r.created_at,
    sender: r.sender,
  }));
};
