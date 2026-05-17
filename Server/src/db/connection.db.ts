import { prisma } from "../lib/prisma.lib.js";

export const connection = async () => {
  prisma.$connect()
  .then(() => console.log("✅ Database connected"))
  .catch((err: any) => {
    console.error("❌ Database connection failed", err);
    process.exit(1);
  });
}