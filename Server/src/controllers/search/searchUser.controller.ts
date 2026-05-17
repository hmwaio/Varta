import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { searchUsers } from "../../services/search/searchUsers.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const searchUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.user_id;
    const query = req.query.query as string;
    if (!query) return errorResponse(res, "Search query required.", BAD_REQUEST);

    const request = await searchUsers({ userId, query });

    return successResponse(res, request, "Users found.", OK);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, BAD_REQUEST);
    } else {
      return errorResponse(res, "Internal server error", INTERNAL_SERVER_ERROR);
    }
  }
};
