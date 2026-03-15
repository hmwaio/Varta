import { prisma } from "../../lib/prisma.lib.js";

type GetPendingRequestData = {
  userId: string;
}

export const getPendingRequest = async (data: GetPendingRequestData) => {

}