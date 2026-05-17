import type {
  LoginInputType,
  NewPasswordInputType,
  SendOTPInputType,
  SignupInputType,
  VerifyOTPInputType,
} from "../types/auth.type.js";
import type { User } from "../types/user.type.js";
import apiClient from "./client.api.js";

export const authAPI = {
  getMe: () => {
    return apiClient.get("/profile/me");
  },
  getToken: () => {
    return apiClient.get("/auth/token");
  },
  /* Signup */
  sendOtp: (data: SendOTPInputType) => {
    return apiClient.post("/auth/send-otp", data);
  },

  verifyOtp: (data: VerifyOTPInputType) => {
    return apiClient.post<{
      data: any;
      tempToken: string;
    }>("/auth/verify-otp", data);
  },

  completeRegistration: (data: SignupInputType, tempToken: string) => {
    return apiClient.post<{ user: User }>("/auth/registration", data, {
      headers: { Authorization: `Bearer ${tempToken}` },
    });
  },

  /* Login */
  login: (data: LoginInputType) => {
    return apiClient.post<{ user: User }>("/auth/login", data);
  },

  /* Logout */
  logout: () => {
    return apiClient.post("/auth/logout");
  },

  /* Forgot password */
  forgotPassword: (data: SendOTPInputType) => {
    return apiClient.post("/auth/forgot-password", data);
  },

  verityResetOtp: (data: VerifyOTPInputType) => {
    return apiClient.post("/auth/verify-reset-otp", data);
  },

  resetPassword: (data: NewPasswordInputType, tempToken: string) => {
    return apiClient.post("/auth/reset-password", data, {
      headers: { Authorization: `Bearer ${tempToken}` },
    });
  },
};
