import apiClient from "./client.api";

export const userAPI = {
  // Get own profile
  getMyProfile: () => {
    return apiClient.get("/profile/me");
  },

  // Update profile
  updateProfile: (data: unknown) => {
    return apiClient.patch("/profile/me", data);
  },

  changeEmailRequest: (data: { newEmail: string; password: string }) => {
    return apiClient.post("/profile/me/account/change-email/request", data);
  },

  changeEmailVerify: (data: { email: string; otp: string }) => {
    return apiClient.post("/profile/me/account/change-email/verify", data);
  },

  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return apiClient.patch("/profile/me/account/change-password", data);
  },

  // Delete account
  deleteAccount: (password: string) => {
    return apiClient.delete("/profile/me/account", { data: { password } });
  },

  deleteProfilePicture: (type: "profile" | "cover") => {
    return apiClient.delete(`/profile/me/picture/${type}`);
  },
};
