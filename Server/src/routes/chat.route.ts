import { Router } from "express";
import { createGroupConversationControl } from "../controllers/conversations/createGroupConversation.controller.js";
import { getMessageControl } from "../controllers/messages/getMessage.controller.js";
import { sendMessageControl } from "../controllers/messages/sendMessage.controller.js";
import { authenticate } from "../middlewares/auth/auth.middleware.js";

const router = Router();

router.use(authenticate);

/* DM — identified by targetId (userId) */
router.post("/dm/:targetId/message", sendMessageControl);
router.get("/dm/:targetId/messages", getMessageControl);
// router.patch("/dm/:targetId/:messageId/message", updateMessageControl);
// router.delete("/dm/:targetId/:messageId/message", deleteMessageControl);

/* Group */
/* create group */
router.post("/group", createGroupConversationControl);
router.post("/group/:conversationId/message", sendMessageControl);
router.get("/group/:conversationId/messages", getMessageControl);


export default router;
