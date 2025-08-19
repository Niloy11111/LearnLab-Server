import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { ModuleRoutes } from "../modules/course-modules/course-module.routes";
import { CourseRoutes } from "../modules/Course/course.routes";
import { LectureRoutes } from "../modules/lectures/lecture.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
import { UserRoutes } from "../modules/user/user.routes";
const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },

  {
    path: "/product",
    route: CourseRoutes,
  },
  {
    path: "/module",
    route: ModuleRoutes,
  },
  {
    path: "/lecture",
    route: LectureRoutes,
  },

  {
    path: "/review",
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
