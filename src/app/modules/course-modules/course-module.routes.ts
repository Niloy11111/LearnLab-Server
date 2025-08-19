import { Router } from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "../user/user.interface";
import { CourseModuleController } from "./course-module.controller";
import { CourseModuleValidation } from "./course-module.validation";

const router = Router();

router.get(
  "/my-shop",
  auth(UserRole.USER),
  CourseModuleController.createCourseModule
);
router.post(
  "/create-module",
  auth(UserRole.ADMIN),
  validateRequest(CourseModuleValidation.createCourseModuleValidation),
  CourseModuleController.createCourseModule
);

router.get("/:courseId", CourseModuleController.getAllCourseModules);

router.patch(
  "/:moduleId",
  auth(UserRole.ADMIN),
  CourseModuleController.updateCourseModule
);

router.patch(
  "/:moduleId/delete",
  auth(UserRole.ADMIN),
  CourseModuleController.deleteCourseModule
);

export const ModuleRoutes = router;
