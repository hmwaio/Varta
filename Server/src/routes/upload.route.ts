import { Router } from "express";
import { uploadFiles } from "../controllers/upload/upload.controller.js";
import { uploadProfileController } from "../controllers/upload/uploadProfile.controller.js";
import { authenticate } from "../middlewares/auth/auth.middleware.js";
import { uploadMiddleware } from "../middlewares/upload/upload.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/presigned-url", uploadFiles);
router.post("/profile-picture", uploadMiddleware, uploadProfileController);

export default router;
