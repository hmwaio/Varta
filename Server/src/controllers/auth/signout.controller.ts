import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";

const { OK, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const signout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.cookie("token", "");
    res.status(OK).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};
