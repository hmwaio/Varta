import { useEffect, useState } from "react";
import { userAPI } from "../../api/user.api";
import { useResolveUserId } from "../users/useResolvedUserId";
import { useSocket } from "./useSocket";

export const usePresence = (targetUserId?: string) => {
  const socket = useSocket();
  const resolvedId = useResolveUserId(targetUserId);
  const [status, setStatus] = useState<"online" | "offline">("offline");
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !resolvedId) return;

    let mounted = true;

    const fetchStatus = async () => {
      try {
        const res = await userAPI.userStatus(resolvedId);
        if (!mounted) return;
        setStatus(res.data.data.status);
        setLastSeen(res.data.data.lastSeen);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus();

    const statusHandler = ({ userId, status, lastSeen }: any) => {
      if (userId !== resolvedId) return;
      setStatus(status);
      setLastSeen(status === "online" ? null : (lastSeen ?? null));
    };

    socket.on("user:status", statusHandler);
    socket.on("connect", fetchStatus);
    socket.emit("presence:request", resolvedId);

    return () => {
      mounted = false;
      socket.off("user:status", statusHandler);
      socket.off("connect", fetchStatus);
    };
  }, [socket, resolvedId]);

  return { status, lastSeen };
};
