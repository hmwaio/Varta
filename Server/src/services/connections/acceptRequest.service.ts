import { prisma } from "../../lib/prisma.lib.js";
import { resolveUserId } from "../../utils/resolveUser.js";

type AcceptRequestData = {
  senderId: string;
  receiverId: string;
};

export const acceptRequest = async (data: AcceptRequestData) => {
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
    throw new Error("You can't accept this request");

  /* Create Connection + Delete request in one transaction */
  const [connection] = await prisma.$transaction([
    prisma.connection.create({
      data: {
        sender_id: request.sender_id,
        receiver_id: request.receiver_id,
        status: "CONNECTED",
      },
    }),
    prisma.connectionRequest.delete({
      where: {
        sender_id_receiver_id: {
          sender_id: senderId,
          receiver_id: receiverId,
        },
      },
    }),
    // Update conversation is_request to false
  ]);
  await prisma.conversation.updateMany({
    where: {
      type: "DIRECT",
      is_request: true,
      AND: [
        { participants: { some: { user_id: senderId } } },
        { participants: { some: { user_id: receiverId } } },
      ],
    },
    data: { is_request: false },
  });

  return connection;
};
