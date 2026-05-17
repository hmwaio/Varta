import { Router } from "express";
import { searchUserController } from "../controllers/search/searchUser.controller.js";
import { authenticate } from "../middlewares/auth/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", searchUserController);

export default router;
