import { useEffect, useState, type ReactNode } from "react";
import { authAPI } from "../api/auth.api";
import { disconnectSocket, initSocket } from "../lib/socket.js";
import type { LoginInputType, SignupInputType } from "../types/auth.type";
import type { User } from "../types/user.type";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ───────────────────── Socket Initialization ──────────────────────── */
  const initializeRealtime = () => {
    initSocket();
  };

  /* ───────────────────── Auth Restore ──────────────────────── */
  const checkAuth = async () => {
    try {
      const me = await authAPI.getMe();
      setUser(me.data.data);

      // Re-connect socket after page refresh
      initializeRealtime();
    } catch (error) {
      setUser(null);
      disconnectSocket();
      return error;
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────────── Login ──────────────────────── */
  const login = async (data: LoginInputType) => {
    await authAPI.login(data);
    initializeRealtime();
    const me = await authAPI.getMe();
    setUser(me.data.data);
  };

  /* ───────────────────── SignUp ──────────────────────── */
  const signup = async (data: SignupInputType, tempToken: string) => {
    await authAPI.completeRegistration(data, tempToken); // server sets cookie
    initializeRealtime();
    const me = await authAPI.getMe();
    setUser(me.data.data);
  };

  /* ───────────────────── Logout ──────────────────────── */
  const logout = async () => {
    await authAPI.logout();
    disconnectSocket();
    setUser(null);
  };

  /* ───────────────────── Initial Auth Check ──────────────────────── */
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
