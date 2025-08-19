import { Schema, model } from "mongoose";
import { ILecture } from "./lecture.interface";

const lectureSchema = new Schema<ILecture>(
  {
    lectureTitle: {
      type: String,
      required: [true, "Module title is required"],
      unique: true,
      trim: true,
    },
    module: {
      type: Schema.Types.ObjectId,
      ref: "CourseModule",
      required: [true, "Module ID is required"],
    },
    videoURL: {
      type: String,
      required: [true, "Video Link is required"],
    },
    pdfUrls: {
      type: [String],
      required: [true, "Lecture pdf are required"],
    },
    lectureNumber: {
      type: Number,
      default: 0,
      min: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

lectureSchema.pre("save", async function (next) {
  if (!this.lectureNumber) {
    const count = await Lecture.countDocuments({ module: this.module });
    this.lectureNumber = count + 1;
  }
  next();
});

const Lecture = model<ILecture>("Lecture", lectureSchema);

export default Lecture;
