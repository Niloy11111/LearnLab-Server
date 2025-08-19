import { z } from "zod";

const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z
      .string()
      .min(108, "description must be at least 108 characters")
      .max(144, "description must not exceed 144 characters")
      .optional(),
    price: z.coerce.number().positive().min(0).int(),
    // imageUrls: z
    //   .array(z.instanceof(File))
    //   .min(1, "At least one photo is required"),
  }),
});

export const CourseValidation = {
  createCourseValidationSchema,
};
