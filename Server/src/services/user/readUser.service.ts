import { prisma } from "../../lib/prisma.lib.js";

type getUserByUsernameType = {
  username: string;
};

export const getUserByUsername = async (data: getUserByUsernameType) => {
  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
    select: {
      name: true,
      username: true,
      is_deleted: true,
      created_at: true,
      profile: {
        select: {
          bio: true,
          profile_picture: true,
        },
      },
    },
  });
  if (!user) throw new Error("User not found!");

  // Deleted account — show minimal info only
  if (user.is_deleted) {
    return {
      name: "Deleted Account",
      username: user.username,
      bio: null,
      profile_picture: null,
      is_deleted: true,
    };
  }

  // Active account — show public info only
  return {
    name: user.name,
    username: user.username,
    bio: user.profile?.bio ?? null,
    profile_picture: user.profile?.profile_picture ?? null,
    is_deleted: false,
  };
};
