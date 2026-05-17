import { prisma } from "../../lib/prisma.lib.js";

type ReadProfileType = {
  userId: string;
};

export const readProfile = async (data: ReadProfileType) => {
  const { userId } = data;

  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      name: true,
      username: true,
      email: true,
      is_verified: true,
      is_deleted: true,
      created_at: true,
      profile: {
        select: {
          bio: true,
          profile_picture: true,
          profile_picture_id: true,
        },
      },
    },
  });
  if (!user) throw new Error("User not exist");
  if (user.is_deleted) throw new Error("Account has been deleted.");

  return user;
};
