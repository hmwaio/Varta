import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { getConnectionStatus } from "../../services/connections/getConnectionStatus.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const getConnectionStatusReq = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.user_id;
    const targetId = req.params.targetId as string;
    
    const request = await getConnectionStatus({ userId, targetId });

    return successResponse(res, request, "Get connection status.", OK);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, BAD_REQUEST);
    } else {
      return errorResponse(res, "Internal server error", INTERNAL_SERVER_ERROR);
    }
  }
};
