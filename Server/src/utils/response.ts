import type { Response } from "express";
import { HTTP_STATUS } from "../constants/statusCodes.constant.js";
const { OK, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const successResponse = (
  res: Response,
  data: any,
  message?: string,
  statusCode: number = OK,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  error: string,
  statusCode: number = INTERNAL_SERVER_ERROR,
) => {
  return res.status(statusCode).json({
    success: false,
    error,
  });
};
