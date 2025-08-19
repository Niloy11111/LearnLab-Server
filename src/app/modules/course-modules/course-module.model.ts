import { Schema, model } from "mongoose";
import { ICourseModule } from "./course-module.interface";

const courseModuleSchema = new Schema<ICourseModule>(
  {
    moduleTitle: {
      type: String,
      required: [true, "Module title is required"],
      unique: true,
      trim: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Course ID is required"],
    },
    moduleNumber: {
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

courseModuleSchema.pre("save", async function (next) {
  if (!this.moduleNumber) {
    const count = await CourseModule.countDocuments({ course: this.course });
    this.moduleNumber = count + 1;
  }
  next();
});

const CourseModule = model<ICourseModule>("CourseModule", courseModuleSchema);

export default CourseModule;
