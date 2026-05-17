import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { getUserStatus } from "../../services/user/userStatus.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const getUserStatusController = async (req: Request, res: Response) => {
  try {
    const targetId = req.params.targetId as string;

    const message = await getUserStatus({
      targetId,
    });

    return successResponse(res, message, "User status.", OK);
  } catch (error) {
    const isClientError =
      error instanceof Error && error.message.includes("not found");
    return errorResponse(
      res,
      error instanceof Error ? error.message : "Internal server error",
      isClientError ? BAD_REQUEST : INTERNAL_SERVER_ERROR,
    );
  }
};
