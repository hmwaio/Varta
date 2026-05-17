import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { blockUser } from "../../services/connections/blockUser.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const blockUserReq = async (req: Request, res: Response) => {
  try {
    const blockerId = req.user!.user_id;
    const blockedId = req.params.targetId as string;

    const request = await blockUser({ blockedId, blockerId });

    return successResponse(res, request, "User blocked.", OK);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, BAD_REQUEST);
    } else {
      return errorResponse(res, "Internal server error", INTERNAL_SERVER_ERROR);
    }
  }
};
