import type { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";

const { BAD_REQUEST } = HTTP_STATUS;

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(BAD_REQUEST).json({
        success: false,
        error: "Validation failed",
        details: error.errors,
      });
    }
  };
};