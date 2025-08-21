import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middleware/auth";
import { parseBody } from "../../middleware/bodyParser";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "../user/user.interface";
import { ProductController } from "./course.controller";
import { CourseValidation } from "./course.validation";

const router = Router();

router.get("/", ProductController.getAllProduct);

router.get("/trending", ProductController.getTrendingProducts);

router.get(
  "/my-shop-products",
  auth(UserRole.USER),
  ProductController.getMyShopProducts
);

router.get("/:productId", ProductController.getSingleProduct);

// auth(UserRole.Landlord),
router.post(
  "/",
  auth(UserRole.ADMIN),
  multerUpload.single("thumbnail"),
  parseBody,
  validateRequest(CourseValidation.createCourseValidationSchema),
  ProductController.createProduct
);

router.patch(
  "/:productId",
  auth(UserRole.ADMIN),
  multerUpload.single("thumbnail"),
  parseBody,
  validateRequest(CourseValidation.createCourseValidationSchema),
  ProductController.updateProduct
);

router.patch(
  "/:productId/delete",
  auth(UserRole.ADMIN),
  ProductController.deleteProduct
);

export const CourseRoutes = router;
