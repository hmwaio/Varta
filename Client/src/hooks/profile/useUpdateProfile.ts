import { useState } from "react";
import { userAPI } from "../../api/profile.api";

export const useUpdateProfile = (onSuccess?: () => void) => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    try {
      setLoading(true);
      await userAPI.updateProfile({ name, bio });
      onSuccess?.(); // optional refetch
      alert("Profile updated!");
    } catch (error) {
      alert("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    bio,
    setName,
    setBio,
    updateProfile,
    loading,
  };
};
