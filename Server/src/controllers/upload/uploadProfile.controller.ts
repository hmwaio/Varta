import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { uploadProfilePicture } from "../../services/upload/uploadProfile.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, UNAUTHORIZED } = HTTP_STATUS;

export const uploadProfileController = async (req: Request, res: Response) => {
  try {
    if (!req.user?.user_id) {
      return errorResponse(res, "Unauthorized", UNAUTHORIZED);
    }

    if (!req.file) {
      return errorResponse(res, "No file uploaded.", BAD_REQUEST);
    }

    const result = await uploadProfilePicture({
      userId: req.user.user_id,
      fileBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
    });

    return successResponse(res, result, "Profile picture updated.", OK);
  } catch (err: any) {
    return errorResponse(
      res,
      err?.message || "Something went wrong",
      BAD_REQUEST,
    );
  }
};
