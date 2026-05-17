import cookie from "cookie";
import http from "http";
import { Server, Socket } from "socket.io";
import { registerCallHandlers } from "../socket/call.handler.js";
import { registerChatHandlers } from "../socket/chat.handler.js";
import { verifyToken } from "../utils/jwt.js";

let io: Server;

// const allowedOrigins = [
//   process.env.CLIENT_URL || "http://localhost:5173",
//   ...(isDev ? ["http://127.0.0.1:5173"] : []),
// ];

export const initSocket = (httpServer: http.Server) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.CLIENT_URL || "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3001",
        "null", // for local HTML files opened directly
      ],
      credentials: true,
    },
    transports: ["websocket"],
    pingTimeout: 2000,
    pingInterval: 25000,
  });

  // ─── Auth Middleware ─────────────────────────────────────────
  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.token;
      if (!token) return next(new Error("Authentication required."));
      const decoded = verifyToken(token);
      if (!decoded?.user_id) return next(new Error("Invalid token."));

      (socket as Socket & { userId: string }).userId = decoded.user_id;
      next();
    } catch (error) {
      next(new Error("Authentication failed."));
    }
  });

  // ─── Connection ──────────────────────────────────────────────
  io.on("connection", (socket) => {
    const authSocket = socket as Socket & { userId: string };

    registerChatHandlers(io, authSocket);
    registerCallHandlers(io, authSocket);
  });

  console.log("✅ Socket.io initialized");
  return io;
};

export const getIO = (): Server => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
