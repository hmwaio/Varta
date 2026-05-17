// import dotenv from "dotenv";
// dotenv.config({
//   path: `.env.${process.env.NODE_ENV || "development"}`,
// });

// import http from "http";
// import app from "./app.js";
// import { connection } from "./db/connection.db.js";
// import { startCleanupJob } from "./jobs/cleanup.job.js";
// import { connectKafka } from "./lib/kafka.lib.js";
// import { connectRedis, redis } from "./lib/redis.lib.js";
// import { initSocket } from "./lib/socketio.lib.js";
// import { testConnection } from "./services/email/email.service.js";

// const PORT = process.env.PORT || 3000;

// // Express app → HTTP server → Socket.io attaches here
// const httpServer = http.createServer(app);

// initSocket(httpServer);

// /* Start Server */
// httpServer.listen(PORT, async () => {
//   console.log(`✅ App is listening on http://localhost:${PORT}`);
//   startCleanupJob();

//   await connection();
//   await connectRedis();
//   await connectKafka();
//   await testConnection();

//   // on server start, clear all presence keys
//   await redis.del(await redis.keys("presence:*"));
//   await redis.del(await redis.keys("user:sockets:*"));
// });

import dotenv from "dotenv";
dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

import http from "http";
import app from "./app.js";
import { connection } from "./db/connection.db.js";
import { startCleanupJob } from "./jobs/cleanup.job.js";
import { startChatConsumer } from "./kafka/chatConsumer.js";
import { connectQueue } from "./lib/queue.lib.js";
import { connectRedis, redis } from "./lib/redis.lib.js";
import { initSocket } from "./lib/socketio.lib.js";
import { testConnection } from "./services/email/email.service.js";

const PORT = process.env.PORT || 3000;

const bootstrap = async () => {
  // 1. Connect all services first
  await connection();
  await connectRedis();
  // await connectKafka();
  await connectQueue();
  await startChatConsumer();
  await testConnection();

  // 2. Flush stale presence data
  const presenceKeys = await redis.keys("presence:*");
  const socketKeys = await redis.keys("user:sockets:*");
  if (presenceKeys.length) await redis.del(presenceKeys);
  if (socketKeys.length) await redis.del(socketKeys);

  // 3. Start HTTP + Socket
  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`✅ App is listening on http://localhost:${PORT}`);
    startCleanupJob();
  });
};

bootstrap().catch((err) => {
  console.error("❌ Bootstrap failed", err);
  process.exit(1);
});
