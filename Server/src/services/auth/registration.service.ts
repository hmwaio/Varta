import { prisma } from "../../lib/prisma.lib.js";
import type { CompleteRegistrationInput } from "../../types/auth.type.js";
import { signToken } from "../../utils/jwt.js";
import { hashPassword } from "../../utils/passwords.js";
import { generateUsername } from "../../utils/username.util.js";
import { createProfile } from "../profile/createProfile.service.js";

/* CompleteRegistration */
export const completeRegistration = async (
  data: CompleteRegistrationInput,
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

  const existingUser = await prisma.user.findUnique({
    where: { email: authSession.email },
  });
  if (existingUser) {
    throw new Error("User already have account");
  }

  /* Hash password before save into DB */
  const hashedPassword = await hashPassword(data.password);
  const username = await generateUsername(data.name);

  /* save into DB */
  const user = await prisma.user.create({
    data: {
      email: authSession.email,
      password: hashedPassword,
      name: data.name,
      username: username,
      is_verified: true,
    },
  });

  /* auto create profile */
  await createProfile(user.user_id);

  /* Delete AuthSession */
  await prisma.authSession.delete({
    where: { authsession_id: tempToken },
  });

  /* Generate token */
  const token = signToken({
    user_id: user.user_id,
    email: user.email,
    name: user.name,
  });
  return { user, token };
};
