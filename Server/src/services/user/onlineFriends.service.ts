import { prisma } from "../../lib/prisma.lib.js";
import { redis } from "../../lib/redis.lib.js";

type GetOnlineFriendsType = {
  userId: string;
};

export const getOnlineFriends = async (data: GetOnlineFriendsType) => {
  const { userId } = data;

  // Get all connected users
  const connections = await prisma.connection.findMany({
    where: {
      OR: [
        { sender_id: userId },
        { receiver_id: userId },
      ],
      status: "CONNECTED",
    },
    include: {
      sender: {
        select: {
          user_id: true,
          name: true,
          username: true,
          profile: { select: { profile_picture: true } },
        },
      },
      receiver: {
        select: {
          user_id: true,
          name: true,
          username: true,
          profile: { select: { profile_picture: true } },
        },
      },
    },
  });

  // Get the other user from each connection
  const friends = connections.map((c: { sender_id: string; receiver: any; sender: any; }) =>
    c.sender_id === userId ? c.receiver : c.sender
  );

  // Check Redis presence for each friend
  const onlineFriends = await Promise.all(
    friends.map(async (friend: { user_id: any; }) => {
      const presence = await redis.get(`presence:${friend.user_id}`);
      return { ...friend, status: presence === "online" ? "online" : "offline" };
    })
  );

  // Return only online friends
  return onlineFriends.filter((f: { status: string; }) => f.status === "online");
};