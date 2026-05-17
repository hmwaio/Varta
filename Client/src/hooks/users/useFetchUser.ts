import { useCallback, useEffect, useState } from "react";
import { userAPI } from "../../api/user.api";
import type { OtherUser } from "../../types/user.type";

export const useFetchUser = (targetId: string | undefined) => {
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!targetId) return;

    try {
      setLoading(true);
      const res = await userAPI.getUser(targetId);
      setOtherUser(res.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, [targetId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    otherUser,
    loading,
    error,
    refetch: fetchUser,
  };
};
