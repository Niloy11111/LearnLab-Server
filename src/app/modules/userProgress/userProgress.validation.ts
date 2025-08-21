import { z } from "zod";

const createUserProgressValidation = z.object({
  body: z.object({
    userId: z.string().min(1, "User ID is required"),
    completedLectures: z.array(z.string()).optional().default([]),
    unlockedLectures: z.array(z.string()).optional().default([]),
  }),
});

const updateUserProgressValidation = z.object({
  body: z.object({
    completedLectures: z.array(z.string()).optional(),
    unlockedLectures: z.array(z.string()).optional(),
  }),
});

export const UserProgressValidation = {
  createUserProgressValidation,
  updateUserProgressValidation,
};
