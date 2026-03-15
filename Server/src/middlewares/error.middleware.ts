import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HTTP_STATUS } from "../constants/statusCodes.constant.js";

const { BAD_REQUEST, NOT_FOUND, CONFLICT, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log("❌ Error:", err);

  /* Prisma error */
  if (err.code === "P2002") {
    return res.status(CONFLICT).json({
      success: false,
      error: "Resource already exists",
    });
  }
  if (err.code === "P2025") {
    return res.status(NOT_FOUND).json({
      success: false,
      error: "Resource not found",
    });
  }

  // zod validation error
  if (err instanceof ZodError) {
    return res.status(BAD_REQUEST).json({
      success: false,
      error: "Validation error",
      details: err.issues,
    });
  }

  // custom error with message
  if (err.message) {
    return res.status(err.status || BAD_REQUEST).json({
      error: err.message,
    });
  }

  // Default error
  res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    error: "Internal server error",
  });
};
