import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { getSocket } from "../../lib/socket";

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(() => getSocket());

  useEffect(() => {
    if (socket) return; // this is fine, returns void

    const interval = setInterval(() => {
      const s = getSocket();
      if (s) {
        setSocket(s);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [socket]);

  return socket;
};
