import { Router } from "express";
import { readUsernameController } from "../controllers/user/readUser.controller.js";
import { getUserStatusController } from "../controllers/user/userStatus.controller.js";
import { authenticate } from "../middlewares/auth/auth.middleware.js";

const router = Router();

router.use(authenticate);


router.get("/status/:targetId", getUserStatusController);
router.get("/:username", readUsernameController);

export default router;
