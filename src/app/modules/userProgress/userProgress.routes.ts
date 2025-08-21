import { Router } from "express";

import validateRequest from "../../middleware/validateRequest";

import { UserProgressController } from "./userProgress.controller";
import { UserProgressValidation } from "./userProgress.validation";

const router = Router();

router.get("/", UserProgressController.getAllUserProgress);

router.post(
  "/create",
  validateRequest(UserProgressValidation.createUserProgressValidation),
  UserProgressController.createUserProgress
);

router.patch("/:progressId/update", UserProgressController.updateUserProgress);

export const UserProgressRoutes = router;
