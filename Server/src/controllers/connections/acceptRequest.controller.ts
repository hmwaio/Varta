import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { acceptRequest } from "../../services/connections/acceptRequest.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const acceptReq = async (req: Request, res: Response) => {
  try {
    const receiverId = req.user!.user_id;
    const senderId = req.params.targetId as string;

    const request = await acceptRequest({ receiverId, senderId });

    return successResponse(res, request, "Connection request accepted.", OK);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, BAD_REQUEST);
    } else {
      return errorResponse(res, "Internal server error", INTERNAL_SERVER_ERROR);
    }
  }
};
