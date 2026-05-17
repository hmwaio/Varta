import { redis } from "../../lib/redis.lib.js";
import { resolveUserId } from "../../utils/resolveUser.js";

type GetUserStatusType = {
  targetId: string;
};

export const getUserStatus = async (data: GetUserStatusType) => {
  const { targetId } = data;
  const resolvedId = await resolveUserId(targetId);

  const presence = await redis.get(`presence:${resolvedId}`);
  const lastSeen = await redis.get(`last_seen:${resolvedId}`);

  return {
    userId: resolvedId,
    status: presence === "online" ? "online" : "offline",
    lastSeen: lastSeen ?? null,
  };
};
