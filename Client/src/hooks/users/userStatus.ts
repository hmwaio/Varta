import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userAPI } from "../../api/user.api";

export const useUserStatus = () => {
  const { targetId } = useParams<{ targetId: string }>();
  const [status, setStatus] = useState<"online" | "offline">("offline");

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async () => {
      try {
        const res = await userAPI.userStatus(targetId!);
        if (isMounted) {
          setStatus(res.data.data.status);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (targetId) loadStatus();

    return () => {
      isMounted = false;
    };
  }, [targetId]);

  return { status };
};
