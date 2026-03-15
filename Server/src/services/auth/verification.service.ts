import { prisma } from "../../lib/prisma.lib.js";
import type { VerifyOTPInput } from "../../types/auth.type.js";
import { hashOTP } from "../../utils/otp.util.js";

/* Verify OTP */
export const verifyOTP = async (data: VerifyOTPInput) => {
  const session = await prisma.authSession.findUnique({
    where: { email: data.email },
  });

  if (!session) {
    throw new Error("User not found");
  }

  if (!session.otp) {
    throw new Error("OTP not requested");
  }

  if (session.is_verified) {
    throw new Error("OTP already used. Please request a new one.");
  }

  if (session.otp_expires_at && new Date() > session.otp_expires_at) {
    throw new Error("OTP expired, please request a new one");
  }

  const hashedInput = hashOTP(data.otp);
  if (session.otp !== hashedInput) {
    throw new Error("Invalid OTP");
  }

  await prisma.authSession.update({
    where: { email: data.email },
    data: { is_verified: true },
  });

  return { tempToken: session.authsession_id };
};
