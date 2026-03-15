import { prisma } from "../../lib/prisma.lib.js";

type DeclineRequestData = {
  requestId: string;
  receiverId: string;
}

export const declineRequest = async (data: DeclineRequestData) => {
  const {requestId, receiverId} = data;

  const request = await prisma.connectionRequest.findUnique({
    where: {request_id: requestId}
  });

  if (!request) throw new Error("Request not found");
  if (request.receiver_id !== receiverId) throw new Error("You can't declined this request");

  await prisma.connectionRequest.delete({
    where: { request_id: requestId },
  });
}