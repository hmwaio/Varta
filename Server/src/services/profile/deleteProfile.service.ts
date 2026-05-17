import { prisma } from "../../lib/prisma.lib.js";

type DeleteProfileType = {
  userId: string;
};

export const deleteProfile = async (data: DeleteProfileType) => {
  const { userId } = data;

  await prisma.user.update({
    where: { user_id: userId },
    data: {
      is_deleted: true,
      deleted_at: new Date(),
    },
  });
  return { message: "Account deleted" };
};
