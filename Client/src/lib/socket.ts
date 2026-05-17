import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const listeners: (() => void)[] = [];

export const initSocket = (): Socket => {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
    withCredentials: true,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected", socket?.id);
    // Run any queued listeners
    listeners.forEach((fn) => fn());
    listeners.length = 0;
  });

  socket.on("connect_error", (err) =>
    console.error("🚨 Socket error:", err.message),
  );

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const onSocketReady = (fn: () => void) => {
  if (socket?.connected) {
    fn(); // already connected
  } else {
    listeners.push(fn); // queue for when connected
  }
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
  listeners.length = 0;
};
