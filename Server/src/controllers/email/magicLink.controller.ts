import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/statusCodes.constant.js";
import { verifyMagicToken } from "../../services/email/magicLink.service.js";
import { prisma } from "../../lib/prisma.lib.js";
import { signToken } from "../../utils/jwt.js";

const { OK, BAD_REQUEST } = HTTP_STATUS;

export const verifyMagicLink = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;
    if (!token) {
      return res.status(BAD_REQUEST).json({error: "Invalid Link..."});
    }
    const { email } = await verifyMagicToken(token);

    // check if this is signup or login flow
    const session = await prisma.authSession.findUnique({ where: { email } });

    // mark session verified if exists (signup flow)
    if (session && !session.is_verified) {
      await prisma.authSession.update({
        where: { email },
        data: { is_verified: true },
      });
      return res.status(OK).json({
        message: "Email verified. Complete your registration.",
        tempToken: session.authsession_id,
        flow: "signup",
      });
    }

    // login flow — user already exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("No account found.");

    const token_jwt = signToken({ user_id: user.user_id, email: user.email, name: user.name });

    res.cookie("token", token_jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(OK).json({
      message: "Logged in successfully.",
      flow: "login",
      user: { user_id: user.user_id, email: user.email, name: user.name, username: user.username },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(BAD_REQUEST).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};