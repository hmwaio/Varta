// import { createClient } from "redis";

// const REDIS_URL = process.env.REDIS_URL;
// if (!REDIS_URL) throw new Error("REDIS_URL is not defined");

// const client = createClient({
//   url: REDIS_URL,
// });

// client.on("error", (err) => console.log("❌ Redis error:", err));
// client.on("connect", () => console.log("✅ Redis connected"));

// export const connectRedis = async () => {
//   await client.connect();
// };

// export const redis = client;




import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

export const redis = new Redis.default(REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: REDIS_URL.startsWith("rediss://") ? {} : undefined,
});

redis.on("connect", () => { console.log("✅ Redis connected"); });
redis.on("error", (err: any) => { console.log("❌ Redis error:", err); });

export const connectRedis = async () => {
  await redis.ping();
};