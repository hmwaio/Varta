import { Router } from "express";
import { acceptReq } from "../controllers/connections/acceptRequest.controller.js";
import { blockUserReq } from "../controllers/connections/blockUser.controller.js";
import { declineReq } from "../controllers/connections/declineRequest.controller.js";
import { disconnectUserController } from "../controllers/connections/disconnectUser.controller.js";
import { getConnectionReq } from "../controllers/connections/getConnections.controller.js";
import { getConnectionStatusReq } from "../controllers/connections/getConnectionStatus.controller.js";
import { getPendingReq } from "../controllers/connections/getPendingRequest.controller.js";
import { sendReq } from "../controllers/connections/sendRequest.controller.js";
import { unblockUserController } from "../controllers/connections/unblockUser.controller.js";
import { authenticate } from "../middlewares/auth/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/send-request/:targetId", sendReq);
router.post("/accept-request/:targetId", acceptReq);
router.delete("/disconnect/:targetId", disconnectUserController);
router.delete("/decline-request/:targetId", declineReq);
router.patch("/block-user/:targetId", blockUserReq);
router.patch("/unblock/:targetId", unblockUserController);

router.get("/", getConnectionReq);
router.get("/connection-status/:targetId", getConnectionStatusReq);
router.get("/pending-requests", getPendingReq);

export default router;
