import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { errorResponse } from "../../utils/response.js";

const { BAD_REQUEST } = HTTP_STATUS;

// Store in memory — we process with sharp before S3
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, WEBP allowed"));
    }
    cb(null, true);
  },
});

export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const FILE_FIELD_NAME = "file";
  upload.single(FILE_FIELD_NAME)(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      return errorResponse(res, err.message, BAD_REQUEST);
    }

    if (err) {
      return errorResponse(res, err.message || "Upload error", BAD_REQUEST);
    }

    return next();
  });
};
