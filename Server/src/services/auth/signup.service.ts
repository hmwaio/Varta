import { prisma } from "../../lib/prisma.lib";
import type { SendOtpInput } from "../../types/auth.type";
import { generateOTP } from "../../utils/otp.util";
import { generateMagicToken } from "../email/magicLink.service";

export const signUpUser = async (data: SendOtpInput) => {
  const { otp, expiresAt, hashedOtp } = generateOTP();

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new Error("Account already exists. Please sign in.");
  }

  const existingSession = await prisma.authSession.findUnique({
    where: { email: data.email },
  });

  // Case 1: Session exists and already verified → error
  if (existingSession?.is_verified) {
    throw new Error("OTP already verified. Please complete registration");
  }

  // /* Case 2: Session exists but not verified -> Update OTP (resend case) */
  // if (existingSession && !existingSession.is_verified) {
  //   await prisma.authSession.update({
  //     where: { email: data.email },
  //     data: {
  //       otp: hashedOtp,
  //       otp_expires_at: expiresAt,
  //     },
  //   });
  //   return { otp, email: data.email }; // return to controller for Brevo
  // }

  // /* Case 3: User not exist -> Create new record */
  // await prisma.authSession.create({
  //   data: {
  //     email: data.email,
  //     otp: hashedOtp,
  //     otp_expires_at: expiresAt,
  //   },
  // });

  if (existingSession) {
    await prisma.authSession.update({
      where: { email: data.email },
      data: { otp: hashedOtp, otp_expires_at: expiresAt },
    });
  } else {
    await prisma.authSession.create({
      data: { email: data.email, otp: hashedOtp, otp_expires_at: expiresAt },
    });
  }

  const magicToken = await generateMagicToken(data.email);
  const magicLink = `${process.env.CLIENT_URL}/auth/verify/${magicToken}`;

  return { otp, email: data.email, magicLink }; // return to brevo
};
