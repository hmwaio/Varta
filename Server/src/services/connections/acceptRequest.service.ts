import { prisma } from "../../lib/prisma.lib.js";

type AcceptRequestData = {
  requestId: string;
  receiverId: string;
};

export const acceptRequest = async (data: AcceptRequestData) => {
  const { requestId, receiverId } = data;

  const request = await prisma.connectionRequest.findUnique({
    where: { request_id: requestId },
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
    prisma.connectionRequest.delete({ where: { request_id: requestId } }),
  ]);

  return connection;
};
