import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { generatePresignedUrl } from "../../services/upload/upload.service.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST } = HTTP_STATUS;

export const uploadFiles = async (req: Request, res: Response) => {
  try {
    const { fileName, fileType, fileSize, folder } = req.body;

    if (!fileName || !fileType || !fileSize) {
      return errorResponse(
        res,
        "fileName, fileType and fileSize required.",
        BAD_REQUEST,
      );
    }

    const result = await generatePresignedUrl({
      fileName,
      fileType,
      fileSize,
      folder,
    });
    return successResponse(res, result, "Presigned URL generated.", OK);
  } catch (err: any) {
    return errorResponse(res, err.message, BAD_REQUEST);
  }
};
