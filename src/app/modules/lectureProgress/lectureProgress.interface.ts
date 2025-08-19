import { Schema } from "mongoose";

export interface ILectureProgress extends Document {
  userId: Schema.Types.ObjectId;
  lectureId: Schema.Types.ObjectId;
  isDeleted: boolean;
  isCompleted: boolean;
  unloackedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
