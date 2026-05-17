import { AlertTriangle, Lock, Mail, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../../api/auth.api";
import { userAPI } from "../../../api/profile.api";

export default function AccountSettings() {
  const navigate = useNavigate();

  const [emailForm, setEmailForm] = useState({ newEmail: "", password: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deletePassword, setDeletePassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [otpStage, setOtpStage] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailForVerification, setEmailForVerification] = useState("");

  // Change Email
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailForm.newEmail || !emailForm.password) {
      alert("All fields required");
      return;
    }

    setLoading(true);

    try {
      await userAPI.changeEmailRequest({
        newEmail: emailForm.newEmail,
        password: emailForm.password,
      });

      setEmailForVerification(emailForm.newEmail);
      setOtpStage(true);

      alert("OTP sent to new email");
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpStage) return;
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    setLoading(true);

    try {
      await userAPI.changeEmailVerify({
        email: emailForVerification,
        otp,
      });

      alert("Email updated successfully");
      navigate("/me");
    } catch (error: any) {
      alert(error.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Add password change endpoint to API
      await userAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      alert("Password updated! Please log in again.");
      await authAPI.logout();
      navigate("/login");
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      alert("Password required");
      return;
    }

    setLoading(true);
    try {
      await userAPI.deleteAccount(deletePassword);
      alert("Account deleted");
      navigate("/");
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-600">
            Manage your account security and preferences
          </p>
        </div>

        {/* Change Email */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold">Change Email</h2>
          </div>

          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Email Address
              </label>
              <input
                type="email"
                disabled={otpStage}
                value={emailForm.newEmail}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, newEmail: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="new@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                disabled={otpStage}
                value={emailForm.password}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
          {otpStage && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-3">Enter OTP</h3>

              <input
                type="text"
                autoFocus
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                placeholder="Enter 6-digit OTP"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                minLength={8}
              />
              <p className="text-sm text-gray-500 mt-1">
                At least 8 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
          </div>

          <p className="text-gray-700 mb-4">
            Once you delete your account, there is no going back. All your
            posts, comments, and data will be permanently deleted.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold">Delete Account?</h3>
            </div>

            <p className="text-gray-600 mb-6">
              This action cannot be undone. Enter your password to confirm.
            </p>

            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-red-500 outline-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
