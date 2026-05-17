import { prisma } from "../lib/prisma.lib.js";

// Delete old AuthSessions (older than 1 hour)
export const cleanupAuthSessions = async () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const result = await prisma.authSession.deleteMany({
    where: {
      otp_expires_at: { lt: new Date() }, // expired OTPs only
      is_verified: false, // never delete verified sessions
    },
  });

  console.log(`✅ Cleanup: Deleted ${result.count} expired auth sessions`);
  return result.count;
};

export const cleanupMagicTokens = async () => {
  const result = await prisma.magicToken.deleteMany({
    where: {
      expires_at: { lt: new Date() },
    },
  });

  console.log(`✅ Cleanup: Deleted ${result.count} expired magic tokens`);
  return result.count;
};

// Run every hour
export const startCleanupJob = () => {
  // Run immediately on startup
  cleanupAuthSessions();
  cleanupMagicTokens();

  // run every 1 hour
  setInterval(
    () => {
      cleanupAuthSessions();
      cleanupMagicTokens();
    },
    60 * 60 * 1000,
  );

  console.log("🔄 Cleanup job started (runs every hour)");
};
