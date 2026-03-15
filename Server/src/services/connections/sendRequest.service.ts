import { prisma } from "../../lib/prisma.lib.js";

type SendRequestData = {
  senderId: string;
  receiverId: string;
  introMessage?: string;
};
export const sendRequest = async (data: SendRequestData) => {
  const { senderId, receiverId, introMessage } = data;

  // Can't send to yourself
  if (senderId === receiverId) {
    throw new Error("You can't send a request to yourself");
  }

  /* Check receiver exist */
  const receiver = await prisma.user.findUnique({
    where: { user_id: receiverId },
  });
  if (!receiver) throw new Error("User not found");

  /* Check if already connected or blocked */
  const existingConnection = await prisma.connection.findFirst({
    where: {
      OR: [
        { sender_id: senderId, receiver_id: receiverId },
        { sender_id: receiverId, receiver_id: senderId },
      ],
    },
  });

  if (existingConnection?.status === "CONNECTED")
    throw new Error("Already connected...");
  if (existingConnection?.status === "BLOCKED")
    throw new Error("Unable to send request");

  /* Check if request already exist */
  const existingRequest = await prisma.connectionRequest.findUnique({
    where: {
      sender_id_receiver_id: { sender_id: senderId, receiver_id: receiverId },
    },
  });
  if (existingRequest) throw new Error("Request already sent");

  const request = await prisma.connectionRequest.create({
    data: {
      sender_id: senderId,
      receiver_id: receiverId,
      intro_message: introMessage,
    },
  });

  return request;
};
