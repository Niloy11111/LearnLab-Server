import { z } from "zod";

const createCourseModuleValidation = z.object({
  body: z.object({
    moduleTitle: z.string().min(1, "Module title is required."),
    moduleNumber: z.number().min(0, "Module number is required.").optional(),
  }),
});

export const CourseModuleValidation = {
  createCourseModuleValidation,
};
