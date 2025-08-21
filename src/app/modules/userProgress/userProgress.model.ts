import { Schema, model } from "mongoose";
import { IUserProgress } from "./userProgress.interface";

const userProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    completedLectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "lecture",
      },
    ],
    unlockedLectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "lecture",
      },
    ],
  },
  { timestamps: true }
);

const UserProgress = model<IUserProgress>("UserProgress", userProgressSchema);
export default UserProgress;
