import { Schema } from "mongoose";

export interface ILecture extends Document {
  lectureTitle: string;
  module: Schema.Types.ObjectId;
  lectureNumber: number;
  videoURL: string;
  isDeleted: boolean;
  pdfUrls: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
