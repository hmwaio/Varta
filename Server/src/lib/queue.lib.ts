import { Queue, Worker } from "bullmq";
import { redis } from "./redis.lib.js";

export const chatQueue = new Queue("chat.messages", {
  connection: redis,
  skipVersionCheck: true,
});

export const createChatWorker = (
  processor: ConstructorParameters<typeof Worker>[1],
) => {
  return new Worker("chat.messages", processor, {
    connection: redis,
  });
};

export const connectQueue = async () => {
  console.log("✅ BullMQ connected");
};
