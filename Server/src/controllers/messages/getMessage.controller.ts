import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { getMessage } from "../../services/messages/getMessage.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const getMessageControl = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.user_id;
    const targetId = req.params.targetId as string | undefined;
    const conversationId = req.params.conversationId as string | undefined;
    const { cursor, direction } = req.query as {
      cursor?: string;
      direction?: "older" | "newer";
    };

    const message = await getMessage({
      userId,
      targetId,
      conversationId,
      cursor,
      direction,
    });

    return successResponse(res, message, "Getting messages.", OK);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, BAD_REQUEST);
    } else {
      return errorResponse(res, "Internal server error", INTERNAL_SERVER_ERROR);
    }
  }
};
