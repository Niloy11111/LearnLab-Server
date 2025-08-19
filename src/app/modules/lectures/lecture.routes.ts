import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middleware/auth";
import { parseBody } from "../../middleware/bodyParser";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "../user/user.interface";
import { LectureController } from "./lecture.controller";
import { LectureValidation } from "./lecture.validation";

const router = Router();

router.get("/", LectureController.getAllLectures);

router.post(
  "/create-lecture",
  auth(UserRole.ADMIN),
  multerUpload.fields([{ name: "pdfs" }]),
  parseBody,
  validateRequest(LectureValidation.createLectureValidation),
  LectureController.createLecture
);

router.patch(
  "/:lectureId",
  auth(UserRole.ADMIN),
  multerUpload.fields([{ name: "pdfs" }]),
  parseBody,
  LectureController.updateLecture
);

router.patch(
  "/:lectureId/delete",
  auth(UserRole.ADMIN),
  LectureController.deleteLecture
);
export const LectureRoutes = router;
