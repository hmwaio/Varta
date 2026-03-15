import { prisma } from "../../lib/prisma.lib.js";

type GetConnectionStatusData = {
  userId: string;
  targetId: string;
}

export const getConnectionStatus = async (data: GetConnectionStatusData) => {

}