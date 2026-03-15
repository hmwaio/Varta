import crypto from "crypto";
import { prisma } from "../lib/prisma.lib.js";

export const generateUsername = async (name: string): Promise<string> => {
  const slug = name.toLowerCase().replace(/\s+/g, "");

  let username = "";
  let taken = true;

  while (taken) {
    const suffix = crypto.randomInt(1000, 9999);
    username = `${slug}${suffix}`;
    const existing = await prisma.user.findUnique({ where: { username } });
    taken = !!existing;
  }

  return username;
};
