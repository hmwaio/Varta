import { prisma } from "../../lib/prisma.lib.js";

type GetConnectionsData = {
  userId: string;
};

export const getConnections = async (data: GetConnectionsData) => {
  const { userId } = data;

  const connection = await prisma.connection.findMany({
    where: {
      OR: [{ sender_id: userId }, { receiver_id: userId }],
      status: "CONNECTED",
    },

    include: {
      sender: {
        select: {
          user_id: true,
          username: true,
          name: true,
          profile: true,
        },
      },
      receiver: {
        select: {
          user_id: true,
          username: true,
          name: true,
          profile: true,
        },
      },
    },
  });

  return connection.map((c) =>
    c.sender_id === userId ? c.receiver : c.sender,
  );
};
