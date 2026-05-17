import { prisma } from "../lib/prisma.lib.js";
import { BATCH_INTERVAL } from "../types/message.type.js";
// import { consumer } from "../lib/kafka.lib.js";

// const BATCH_INTERVAL_MS = BATCH_INTERVAL; // 30 seconds
// const messageBuffer: any[] = [];

// export const startChatConsumer = async () => {
//   await consumer.subscribe({ topic: "chat.messages", fromBeginning: false });

//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       const value = message.value?.toString();
//       if (!value) return;
//       messageBuffer.push(JSON.parse(value));
//     },
//   });

//   // Every 30s — flush buffer to DB
//   setInterval(async () => {
//     if (messageBuffer.length === 0) return;

//     const batch = [...messageBuffer];
//     messageBuffer.length = 0; // clear buffer

//     try {
//       await prisma.message.createMany({
//         data: batch.map((m) => ({
//           message_id: m.message_id,
//           conversation_id: m.conversation_id,
//           sender_id: m.sender_id,
//           sender_name: m.sender_name,
//           sender_picture: m.sender_picture ?? null,
//           content: m.content,
//           type: m.type,
//           created_at: new Date(m.created_at),
//         })),
//         skipDuplicates: true,
//       });
//       console.log(`✅ Flushed ${batch.length} messages to DB`);
//     } catch (err) {
//       console.log("❌ Failed to flush messages to DB", err);
//       messageBuffer.unshift(...batch);
//     }
//   }, BATCH_INTERVAL_MS);

//   console.log("✅ Chat consumer started");
// };



/* BullMQ */
import { createChatWorker } from "../lib/queue.lib.js";
const BATCH_INTERVAL_MS = BATCH_INTERVAL;
const messageBuffer: any[] = [];

export const startChatConsumer = async () => {
  createChatWorker(async (job) => {
    messageBuffer.push(job.data);
  });

  setInterval(async () => {
    if (messageBuffer.length === 0) return;
    const batch = [...messageBuffer];
    messageBuffer.length = 0;
    try {
      await prisma.message.createMany({
        data: batch.map((m) => ({
          message_id: m.message_id,
          conversation_id: m.conversation_id,
          sender_id: m.sender_id,
          sender_name: m.sender_name,
          sender_picture: m.sender_picture ?? null,
          content: m.content,
          type: m.type,
          created_at: new Date(m.created_at),
        })),
        skipDuplicates: true,
      });

      console.log(`✅ Flushed ${batch.length} messages to DB`);
    } catch (err) {
      console.log("❌ Failed to flush", err);
      messageBuffer.unshift(...batch);
    }
  }, BATCH_INTERVAL_MS);
  console.log("✅ Chat worker started");
};
