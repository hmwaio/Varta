import { Router } from "express";
import { send, verify, signup } from "../controllers/auth/signup.controller.js";
import { signin } from "../controllers/auth/signin.controller.js";
import { signout } from "../controllers/auth/signout.controller.js";
import { forgotPass, resetOTP, resetPass } from "../controllers/auth/forgotPass.controller.js";
import { otpPerDayLimiter, otpPerHourLimiter, otpPerMinuteLimiter, otpVerifyLimiter } from "../middlewares/rateLimiter/authRL.middleware.js";
import { validate } from "../middlewares/validations/inputValidate.middleware.js";
import { completeRegistrationSchema, resetPasswordSchema, sendOtpSchema, signInSchema, verifyOtpSchema } from "../types/auth.type.js";
import { verifyMagicLink } from "../controllers/email/magicLink.controller.js";
import { authenticate } from "../middlewares/auth/auth.middleware.js";

const router = Router();

router.get("/token", authenticate, (req, res) => {
  const token = req.cookies.token;
  res.json({ success: true, data: { token } });
});

/* SignUp */
router.post("/send-otp", validate(sendOtpSchema), otpPerMinuteLimiter, otpPerHourLimiter, otpPerDayLimiter, send);
router.post("/resend-otp", validate(sendOtpSchema), otpPerMinuteLimiter, otpPerHourLimiter, otpPerDayLimiter, send)
router.post("/verify-otp", validate(verifyOtpSchema), otpVerifyLimiter, verify);
router.post("/registration", validate(completeRegistrationSchema), signup);
router.get("/magic-link/verify/:token", verifyMagicLink);

/* SignIn */
router.post("/login", validate(signInSchema), signin);

/* SignOut */
router.post("/logout", signout);

/* ForgotPassword */
router.post("/forgot-password", validate(sendOtpSchema), otpPerMinuteLimiter, otpPerHourLimiter, otpPerDayLimiter, forgotPass);
router.post("/verify-reset-otp", validate(verifyOtpSchema), otpVerifyLimiter, resetOTP);
router.post("/reset-password", validate(resetPasswordSchema), resetPass);

export default router;