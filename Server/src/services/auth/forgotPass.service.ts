import { prisma } from "../../lib/prisma.lib.js";
import type {
  ResetPasswordInput,
  SendOtpInput,
  VerifyOTPInput,
} from "../../types/auth.type.js";
import { generateOTP } from "../../utils/otp.util.js";
import { hashPassword } from "../../utils/passwords.js";
import { generateMagicToken } from "../email/magicLink.service.js";
import { verifyOTP } from "./verification.service.js";

export const forgotPassword = async (data: SendOtpInput) => {
  const { otp, expiresAt, hashedOtp } = generateOTP();

  // check if user exist
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.is_verified) {
    throw new Error("No account found with this email");
  }

  // check existing authSession
  const existingSession = await prisma.authSession.findUnique({
    where: { email: data.email },
  });

  if (existingSession) {
    await prisma.authSession.update({
      where: { email: data.email },
      data: {
        otp: hashedOtp,
        otp_expires_at: expiresAt,
        is_verified: false,
      },
    });
  } else {
    await prisma.authSession.create({
      data: {
        email: data.email,
        otp: hashedOtp,
        otp_expires_at: expiresAt,
      },
    });
  }

  // generate magic link for password reset
  const magicToken = await generateMagicToken(data.email);
  const magicLink = `${process.env.CLIENT_URL}/auth/reset-password/${magicToken}`;

  return { otp: otp, email: data.email, magicLink };
};

export const verifyResetOTP = async (data: VerifyOTPInput) => {
  return await verifyOTP(data);
};

export const resetPassword = async (
  newPassword: ResetPasswordInput,
  tempToken: string,
) => {
  const authSession = await prisma.authSession.findUnique({
    where: { authsession_id: tempToken },
  });

  if (!authSession) {
    throw new Error("User not found");
  }
  if (!authSession.is_verified) {
    throw new Error("Please verify OTP first");
  }

  // find user
  const user = await prisma.user.findUnique({
    where: { email: authSession.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // hash new password
  const hashedPassword = await hashPassword(newPassword.newPassword);

  // update password
  await prisma.user.update({
    where: { email: authSession.email },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.authSession.delete({
    where: { authsession_id: tempToken },
  });

  return { message: "Password reset successful" };
};
