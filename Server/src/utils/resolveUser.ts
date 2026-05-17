// src/utils/resolveUser.ts
import { prisma } from "../lib/prisma.lib.js";

export const resolveUserId = async (identifier: string): Promise<string> => {
  const isUUID = /^[0-9a-f-]{36}$/.test(identifier);
  if (isUUID) return identifier;

  const user = await prisma.user.findUnique({
    where: { username: identifier },
    select: { user_id: true },
  });
  if (!user) throw new Error("User not found.");
  return user.user_id;
};