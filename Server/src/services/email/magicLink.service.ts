import crypto from "crypto";
import { prisma } from "../../lib/prisma.lib.js";

const EXPIRES_MINUTES = 5;

export const generateMagicToken = async (email: string): Promise<string> => {
  // delete any existing unused token for this email
  await prisma.magicToken.deleteMany({ where: { email, used: false } });

  const token = crypto.randomBytes(32).toString("hex");
  const expires_at = new Date(Date.now() + EXPIRES_MINUTES * 60 * 1000);

  await prisma.magicToken.create({
    data: { email, token, expires_at },
  });

  return token;
};

export const verifyMagicToken = async (token: string) => {
  const record = await prisma.magicToken.findUnique({ where: { token } });

  if (!record) throw new Error("Invalid or expired magic link.");
  if (record.used) throw new Error("Magic link already used.");
  if (new Date() > record.expires_at) throw new Error("Magic link expired.");

  await prisma.magicToken.update({
    where: { token },
    data: { used: true },
  });

  return { email: record.email };
};