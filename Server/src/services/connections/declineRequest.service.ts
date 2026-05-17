import { prisma } from "../../lib/prisma.lib.js";
import { resolveUserId } from "../../utils/resolveUser.js";

type DeclineRequestData = {
  senderId: string;
  receiverId: string;
};

export const declineRequest = async (data: DeclineRequestData) => {
  const senderId = await resolveUserId(data.senderId);
  const receiverId = await resolveUserId(data.receiverId);

  const request = await prisma.connectionRequest.findUnique({
    where: {
      sender_id_receiver_id: {
        sender_id: senderId,
        receiver_id: receiverId,
      },
    },
  });

  if (!request) throw new Error("Request not found");
  if (request.receiver_id !== receiverId)
    throw new Error("You can't declined this request");

  await prisma.connectionRequest.delete({
    where: {
      sender_id_receiver_id: {
        sender_id: senderId,
        receiver_id: receiverId,
      },
    },
  });

  return { message: "Request declined." };
};
