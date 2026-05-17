import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.js";

export const useSignout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const signout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return signout;
};
