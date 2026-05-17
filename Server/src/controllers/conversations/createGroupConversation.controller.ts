import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { createGroupConversation } from "../../services/conversations/createGroupConversation.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { CREATED, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const createGroupConversationControl = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user!.user_id;
    const { name, memberIds } = req.body;
    if (!name || !memberIds || !Array.isArray(memberIds)) {
      return errorResponse(res, "Invalid input", BAD_REQUEST);
    }

    const request = await createGroupConversation({ userId, memberIds, name });

    return successResponse(
      res,
      request,
      "Created group conversation.",
      CREATED,
    );
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, BAD_REQUEST);
    } else {
      return errorResponse(res, "Internal server error", INTERNAL_SERVER_ERROR);
    }
  }
};
