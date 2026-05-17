import { Router } from "express";
import { authenticate } from "../middlewares/auth/auth.middleware.js";
import { readProfileController } from "../controllers/profile/readProfile.controller.js";
import { updateProfileController } from "../controllers/profile/updateProfile.controller.js";
import { deleteProfileController } from "../controllers/profile/deleteProfile.controller.js";

const router = Router();

router.use(authenticate);

router.get("/me", readProfileController);
router.patch("/me", updateProfileController);
router.delete("/me", deleteProfileController);

export default router;
