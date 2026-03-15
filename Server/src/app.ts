import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { HTTP_STATUS } from "./constants/statusCodes.constant.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.route.js";

const app = express();

const { INTERNAL_SERVER_ERROR } = HTTP_STATUS;

/* Middleware */
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

/* Health Check */
app.get("/health", (req, res) => { res.json({ message: "Server is healthy" }); });

/* Routes */
app.use("/api/auth", authRoutes);

app.use(errorHandler);
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res
    .status(err.status || INTERNAL_SERVER_ERROR)
    .json({ error: err.message || "Internal server error" });
});

export default app;
