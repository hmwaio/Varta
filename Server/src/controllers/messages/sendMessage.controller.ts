import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { sendMessage } from "../../services/messages/sendMessage.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const sendMessageControl = async (req: Request, res: Response) => {
  try {
    const senderId = req.user!.user_id;
    const targetId = req.params.targetId as string | undefined;
    const conversationId = req.params.conversationId as string | undefined;
    const { content, type, file_name, mime_type, file_size } = req.body;

    const message = await sendMessage({
      senderId,
      content,
      conversationId,
      type,
      targetId,
      file_name,
      mime_type,
      file_size
    });

    return successResponse(res, message, "Message sent.", OK);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, BAD_REQUEST);
    } else {
      return errorResponse(res, "Internal server error", INTERNAL_SERVER_ERROR);
    }
  }
};
