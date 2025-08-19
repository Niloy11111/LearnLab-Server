import { Router } from "express";
import clientInfoParser from "../../middleware/clientInfoParser";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", clientInfoParser, AuthController.loginUser);

router.post(
  "/refresh-token",
  // validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);

export const AuthRoutes = router;
