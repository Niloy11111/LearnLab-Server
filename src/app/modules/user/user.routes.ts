import { Router } from "express";
import clientInfoParser from "../../middleware/clientInfoParser";
import validateRequest from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = Router();

router.post(
  "/",
  clientInfoParser,
  validateRequest(UserValidation.userValidationSchema),
  UserController.registerUser
);

export const UserRoutes = router;
