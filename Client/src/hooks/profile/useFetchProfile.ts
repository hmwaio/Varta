import { useCallback, useEffect, useState } from "react";
import { userAPI } from "../../api/profile.api";
import type { MyProfileSafe } from "../../types/profile.type";

export const useFetchProfile = () => {
  const [profile, setProfile] = useState<MyProfileSafe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userAPI.getMyProfile();
      const data = response.data.data;

      const safeProfile: MyProfileSafe = {
        user_id: data.user_id,
        name: data.name,
        username: data.username,
        email: data.email,
        is_verified: data.is_verified,
        is_deleted: data.is_deleted,
        created_at: data.created_at,
        profile: data.profile ?? {
          bio: null,
          profile_picture: null,
          profile_picture_id: null,
        },
      };

      setProfile(safeProfile);
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    setProfile,
    loading,
    error,
    refetch: fetchProfile,
  };
};
