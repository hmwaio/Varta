import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      user?: UserTokenPayLoad;
    }
  }
}

/* Authentication */
const strictEmailRegex =
  /^[a-zA-Z0-9.!#$%&'*\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;

export const sendOtpSchema = z.object({
  email: z.email("Invalid email address"),
});

export const verifyOtpSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const completeRegistrationSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name contain min 2 characters"),
});

export const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

/* Typescript types (inferred from zod schemas) */
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOtpSchema>;
export type CompleteRegistrationInput = z.infer<
  typeof completeRegistrationSchema
>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export type UserTokenPayLoad = {
  user_id: string;
  email: string;
  name: string;
};
