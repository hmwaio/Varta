import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import {
  forgotPassword,
  resetPassword,
  verifyResetOTP,
} from "../../services/auth/forgotPass.service.js";
import { sendOTPEmail } from "../../services/email/email.service.js";
import {
  resetPasswordSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from "../../types/auth.type.js";
import { successResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const forgotPass = async (req: Request, res: Response) => {
  try {
    const data = sendOtpSchema.parse(req.body);
    const { otp, email, magicLink } = await forgotPassword(data);

    // TODO: Send OTP via Brevo here
    await sendOTPEmail(email, otp, magicLink);

    return successResponse(res, { email }, "OTP sent to your email", OK);
  } catch (error) {
    if (error instanceof Error) {
      res.status(BAD_REQUEST).json({ error: error.message });
    } else {
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  }
};

export const resetOTP = async (req: Request, res: Response) => {
  try {
    const data = verifyOtpSchema.parse(req.body);
    const { tempToken } = await verifyResetOTP(data);

    return successResponse(res, { tempToken }, "OTP verified successfully", OK);
  } catch (error) {
    if (error instanceof Error) {
      res.status(BAD_REQUEST).json({ error: error.message });
    } else {
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  }
};

export const resetPass = async (req: Request, res: Response) => {
  try {
    // validate inputs
    const data = resetPasswordSchema.parse(req.body);
    const tempToken = req.headers.authorization?.split(" ")[1];

    if (!tempToken) {
      return res.status(UNAUTHORIZED).json({ error: "No session token" });
    }
    const { message } = await resetPassword(data, tempToken);

    res.status(OK).json({
      message: message,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(BAD_REQUEST).json({ error: error.message });
    } else {
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  }
};
