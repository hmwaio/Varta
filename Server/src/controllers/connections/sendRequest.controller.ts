import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { sendRequest } from "../../services/connections/sendRequest.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const sendReq = async (req: Request, res: Response) => {
  try {
    const senderId = req.user!.user_id;
    const receiverId = req.params.targetId as string;
    const { introMessage } = req.body ?? {};

    const request = await sendRequest({ senderId, receiverId, introMessage });

    return successResponse(res, request, "Connection request sent.", OK);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, BAD_REQUEST);
    } else {
      return errorResponse(res, "Internal server error", INTERNAL_SERVER_ERROR);
    }
  }
};
