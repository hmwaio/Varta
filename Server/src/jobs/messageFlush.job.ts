import { prisma } from "../lib/prisma.lib.js";

const messageBuffer: any[] = [];

export const enqueueMessage = (message: any) => {
  messageBuffer.push(message);
};

export const startMessageFlushJob = () => {
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
      console.error("❌ Failed to flush messages to DB", err);
      messageBuffer.unshift(...batch);
    }
  }, 30 * 1000);

  console.log("✅ Message flush job started");
};
