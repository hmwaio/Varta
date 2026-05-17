import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { getConnections } from "../../services/connections/getConnections.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const getConnectionReq = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.user_id;

    const request = await getConnections({ userId });

    return successResponse(res, request, "Connection fetched.", OK);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, BAD_REQUEST);
    } else {
      return errorResponse(res, "Internal server error", INTERNAL_SERVER_ERROR);
    }
  }
};
