import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middleware/auth";
import { parseBody } from "../../middleware/bodyParser";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "../user/user.interface";
import { ShopController } from "./shop.controller";
import { ShopValidation } from "./shop.validation";

const router = Router();

router.get("/my-shop", auth(UserRole.USER), ShopController.getMyShop);

router.post(
  "/",
  auth(UserRole.USER),
  multerUpload.single("logo"),
  parseBody,
  validateRequest(ShopValidation.createShopValidation),
  ShopController.createShop
);

export const ShopRoutes = router;
