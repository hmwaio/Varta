import { Router } from "express";
import { getDirectConversationController } from "../controllers/conversations/getDirectConversation.controller.js";
import { getGroupConversationController } from "../controllers/conversations/getGroupConversation.controller.js";
import { authenticate } from "../middlewares/auth/auth.middleware.js";
import { createDirectConversationControl } from "../controllers/conversations/createDirectConversation.controller.js";

const router = Router();

router.use(authenticate);

router.get("/direct/:targetId", createDirectConversationControl);

/* DM — identified by targetId (userId) */
router.get("/direct-chat", getDirectConversationController);

/* Group */
router.get("/group-chat", getGroupConversationController);

export default router;
