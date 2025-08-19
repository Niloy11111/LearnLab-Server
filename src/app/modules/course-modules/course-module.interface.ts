import { Schema } from "mongoose";

export interface ICourseModule extends Document {
  moduleTitle: string;
  course: Schema.Types.ObjectId;
  moduleNumber: number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
