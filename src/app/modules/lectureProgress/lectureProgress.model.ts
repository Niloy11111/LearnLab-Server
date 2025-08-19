import { Schema, model } from "mongoose";
import { ILectureProgress } from "./lectureProgress.interface";

const lectureProgressSchema = new Schema<ILectureProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    lectureId: {
      type: Schema.Types.ObjectId,
      ref: "lecture",
      required: [true, "Lecture ID is required"],
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    unloackedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const LectureProgress = model<ILectureProgress>(
  "LectureProgress",
  lectureProgressSchema
);

export default LectureProgress;
