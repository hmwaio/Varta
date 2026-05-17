import { prisma } from "../../lib/prisma.lib.js";
import { hashPassword, verifyPassword } from "../../utils/passwords.js";
import { signUpUser } from "../auth/signup.service.js";

type UpdateProfileType = {
  userId: string;
  name?: string;
  username?: string;
  bio?: string;
  profile_picture?: string;
  profile_picture_id?: string;
};

export const updateProfile = async (data: UpdateProfileType) => {
  const { userId, name, username, bio, profile_picture, profile_picture_id } =
    data;

  if (username) {
    const existing = await prisma.user.findUnique({
      where: { username: username },
    });
    if (existing && existing.user_id !== userId) {
      throw new Error("Username already taken.");
    }
  }

  const [user] = await prisma.$transaction([
    prisma.user.update({
      where: { user_id: userId },
      data: {
        ...(name && { name }),
        ...(username && { username }),
      },
      select: {
        user_id: true,
        username: true,
        name: true,
        email: true,
      },
    }),
    prisma.profile.update({
      where: { user_id: userId },
      data: {
        ...(bio !== undefined && { bio }),
        ...(profile_picture && { profile_picture }),
        ...(profile_picture_id && { profile_picture_id }),
      },
    }),
  ]);

  return user;
};

export const updatePassword = async (data: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) => {
  const { userId, currentPassword, newPassword } = data;

  const user = await prisma.user.findUnique({ where: { user_id: userId } });
  if (!user) throw new Error("User not found.");

  const isValid = await verifyPassword(currentPassword, user.password);
  if (!isValid) throw new Error("Current password is incorrect.");

  const isSame = await verifyPassword(newPassword, user.password);
  if (isSame) throw new Error("New password must be different.");

  if (newPassword.length < 8)
    throw new Error("Password must be at least 8 characters.");

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { user_id: userId },
    data: { password: hashed },
  });

  return { message: "Password changed successfully." };
};

export const requestEmailChange = async (data: {
  userId: string;
  newEmail: string;
  password: string;
}) => {
  const { userId, newEmail, password } = data;

  const user = await prisma.user.findUnique({ where: { user_id: userId } });
  if (!user) throw new Error("User not found.");

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) throw new Error("Password is incorrect.");

  if (newEmail === user.email) throw new Error("New email must be different.");

  const existing = await prisma.user.findUnique({ where: { email: newEmail } });
  if (existing) throw new Error("Email already in use.");

  // Send OTP to new email
  await signUpUser({ email: newEmail });

  return { message: "OTP sent to new email." };
};

export const confirmEmailChange = async (data: {
  userId: string;
  newEmail: string;
  otp: string;
}) => {
  const { userId, newEmail, otp } = data;

  // Verify OTP
  const { verifyOTP } = await import("../auth/verification.service.js");
  const result = await verifyOTP({ email: newEmail, otp });
  if (!result) throw new Error("Invalid OTP.");

  await prisma.user.update({
    where: { user_id: userId },
    data: { email: newEmail },
  });

  return { message: "Email updated successfully." };
};
