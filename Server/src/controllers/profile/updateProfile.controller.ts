import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { updateProfile } from "../../services/profile/updateProfile.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const updateProfileController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.user_id;
    const { username, bio, name, profile_picture, profile_picture_id } =
      req.body;

    const message = await updateProfile({
      userId,
      username,
      bio,
      name,
      profile_picture,
      profile_picture_id,
    });

    return successResponse(res, message, "Profile updated.", OK);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(res, error.message, BAD_REQUEST);
    } else {
      return errorResponse(res, "Internal server error", INTERNAL_SERVER_ERROR);
    }
  }
};
