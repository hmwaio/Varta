import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "varta-server",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({
  groupId: process.env.KAFKA_GROUP_ID || "varta-chat-group",
});

export const connectKafka = async () => {
  await producer.connect();
  await consumer.connect();
  console.log("✅ Kafka connected");
};
