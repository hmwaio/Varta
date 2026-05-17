import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { createDirectConversation } from "../../services/conversations/createDirectConversation.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const createDirectConversationControl = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.user_id;
    const targetId = req.params.targetId as string;

    const directConversation = await createDirectConversation({ userId, targetId });

    return successResponse(res, directConversation, "Created direct conversation.", CREATED);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, BAD_REQUEST);
    } else {
      return errorResponse(res, "Internal server error", INTERNAL_SERVER_ERROR);
    }
  }
};