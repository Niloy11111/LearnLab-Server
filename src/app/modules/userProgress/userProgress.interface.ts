import { Document, Schema } from "mongoose";

export interface IUserProgress extends Document {
  userId: Schema.Types.ObjectId;
  completedLectures: Schema.Types.ObjectId[];
  unlockedLectures: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
