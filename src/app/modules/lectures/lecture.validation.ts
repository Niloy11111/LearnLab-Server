import { z } from "zod";

const createLectureValidation = z.object({
  body: z.object({
    lectureTitle: z.string().min(1, "Lecture title is required."),
    videoURL: z.string().min(1, "Video url is required"),
    lectureNumber: z.number().min(0, "Lecture number is required.").optional(),
  }),
});

export const LectureValidation = {
  createLectureValidation,
};
