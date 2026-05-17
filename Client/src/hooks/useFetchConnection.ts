import { useEffect, useState } from "react";
import { userAPI } from "../api/user.api";

type Connection = {
  user_id: string;
  name: string;
  username: string;
  profile: { profile_picture: string | null } | null;
};

export const useFetchConnection = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchConnections = async () => {
      try {
        setLoading(true);
        const res = await userAPI.getConnectionReq();

        if (isMounted) {
          setConnections(res.data?.data ?? []);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Something went wrong");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchConnections();

    return () => {
      isMounted = false;
    };
  }, []);

  return { connections, loading, error };
};