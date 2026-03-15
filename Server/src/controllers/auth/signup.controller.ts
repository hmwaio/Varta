import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { completeRegistration } from "../../services/auth/registration.service.js";
import { signUpUser } from "../../services/auth/signup.service.js";
import { verifyOTP } from "../../services/auth/verification.service.js";
import { sendOTPEmail } from "../../services/email/email.service.js";
import {
  completeRegistrationSchema,
  sendOtpSchema,
  verifyOtpSchema,
} from "../../types/auth.type.js";
import { errorResponse, successResponse } from "../../utils/response.js";

const { OK, CREATED, BAD_REQUEST, UNAUTHORIZED, INTERNAL_SERVER_ERROR } =
  HTTP_STATUS;

export const send = async (req: Request, res: Response) => {
  try {
    const data = sendOtpSchema.parse(req.body);
    const { otp, email, magicLink } = await signUpUser(data);

    // TODO: Send OTP via Brevo here
    await sendOTPEmail(email, otp, magicLink);

    return successResponse(res, { email }, "OTP sent to your email", OK); // Echo back for frontend confirmation
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

export const verify = async (req: Request, res: Response) => {
  try {
    const data = verifyOtpSchema.parse(req.body);
    const { tempToken } = await verifyOTP(data);

    return successResponse(
      res,
      { tempToken }, // Frontend stores this for Step 3
      "OTP verified successfully",
      OK,
    );
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

export const signup = async (req: Request, res: Response) => {
  try {
    // validate inputs
    const data = completeRegistrationSchema.parse(req.body);
    const tempToken = req.headers.authorization?.split(" ")[1];

    if (!tempToken) {
      return errorResponse(res, "No session token", UNAUTHORIZED);
    }

    const { user, token } = await completeRegistration(data, tempToken);

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // send response
    return successResponse(
      res,
      {
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username,
          name: user.name,
        },
      },
      "Account created successfully",
      CREATED,
    );
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
