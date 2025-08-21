import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/appError";

import { IUserProgress } from "./userProgress.interface";
import UserProgress, { default as LectureProgress } from "./userProgress.model";

const createUserProgress = async (userProgressData: Partial<IUserProgress>) => {
  const isUserExist = await UserProgress.findOne({
    userId: userProgressData?.userId,
  });

  if (isUserExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This user already has a progress"
    );
  }

  const userProgress = await UserProgress.create(userProgressData);
  return userProgress;
};

const getAllUserProgress = async (query: Record<string, unknown>) => {
  const { userId, ...pQuery } = query;

  // Build the filter object
  const filter: Record<string, any> = {};

  // filter by userId
  if (userId) {
    const courseArray =
      typeof userId === "string"
        ? userId.split(",")
        : Array.isArray(userId)
        ? userId
        : [userId];
    filter.userId = { $in: courseArray };
  }

  const productQuery = new QueryBuilder(UserProgress.find(filter), pQuery)
    // .search(["name", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await productQuery.modelQuery.lean();

  const meta = await productQuery.countTotal();

  return {
    meta,
    result: data,
  };
};

const updateUserProgress = async (
  progressId: string,
  payload: { currentLecture: string; nextLecture: string }
) => {
  return await LectureProgress.findByIdAndUpdate(
    progressId,
    {
      $addToSet: {
        completedLectures: payload.currentLecture,
        unlockedLectures: {
          $each: [payload.currentLecture, payload.nextLecture],
        },
      },
    },
    {
      new: true,
    }
  );
};

export const UserProgressService = {
  createUserProgress,
  getAllUserProgress,
  updateUserProgress,
};
