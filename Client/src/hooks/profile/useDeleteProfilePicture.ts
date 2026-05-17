import { useState } from "react";
import { userAPI } from "../../api/profile.api";

export const useDeleteProfilePicture = (refetch: () => Promise<void>) => {
  const [loading, setLoading] = useState(false);

  const deleteProfilePicture = async () => {
    const confirmDelete = window.confirm("Delete profile picture?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await userAPI.deleteProfilePicture("profile");
      await refetch();
      alert("Profile picture deleted");
    } catch (error) {
      alert("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteProfilePicture,
    loading,
  };
};
