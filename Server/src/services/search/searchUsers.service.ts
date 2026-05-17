import { prisma } from "../../lib/prisma.lib.js";

type SearchUsersType = {
  query: string;
  userId: string; // exclude self
};

export const searchUsers = async (data: SearchUsersType) => {
  const { query, userId } = data;

  const users = await prisma.user.findMany({
    where: {
      username: { contains: query, mode: "insensitive" },
      is_deleted: false,
      NOT: { user_id: userId },
    },
    select: {
      username: true,
      name: true,
      profile: {
        select: { profile_picture: true },
      },
    },
    take: 1, // limit results
  });

  return users.map((u) => ({
    username: u.username,
    name: u.name,
    profile_picture: u.profile?.profile_picture ?? null,
  }));
};