import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { signinUser } from "../../services/auth/signin.service.js";
import { signInSchema } from "../../types/auth.type.js";
import { successResponse, errorResponse } from "../../utils/response.js";

const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const signin = async (req: Request, res: Response) => {
  try {
    const data = signInSchema.parse(req.body);

    const { user, token } = await signinUser(data);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return successResponse(
      res,
      {
        user: {
          user_id: user.user_id,
          email: user.email,
          name: user.name,
        }
      },
      "User logged in successfully",
      OK
    )
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
