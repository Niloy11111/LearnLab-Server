// import { StatusCodes } from "http-status-codes";

// import QueryBuilder from "../../builder/QueryBuilder";
// import AppError from "../../errors/appError";
// import { IPdfFiles } from "../../interface/IPdfFile";
// import CourseModule from "../course-modules/course-module.model";
// import { Product } from "../Course/course.model";
// import Lecture from "./lectureProgress.model";

// const createLecture = async (
//   lectureData: Partial<ILecture>,
//   lecturePdfs: IPdfFiles
// ) => {
//   const module = await CourseModule.findById(lectureData?.module);

//   if (!module) {
//     throw new AppError(StatusCodes.NOT_FOUND, "This module is not found!");
//   }

//   const { pdfs } = lecturePdfs;
//   if (!pdfs || pdfs.length === 0) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "Lecture pdfs are required.");
//   }

//   console.log("images", pdfs);

//   lectureData.pdfUrls = pdfs.map((pdf) => pdf.path);

//   // console.log(payload);

//   const lecture = await Lecture.create(lectureData);
//   return lecture;
// };

// const getAllLectures = async (query: Record<string, unknown>) => {
//   const {
//     minPrice,
//     maxPrice,
//     minSquareFeet,
//     maxSquareFeet,
//     categories,
//     brands,
//     inStock,
//     ratings,
//     location,
//     moduleId,
//     moduleTitle,
//     courseTitle,
//     ...pQuery
//   } = query;

//   // Build the filter object
//   const filter: Record<string, any> = {};

//   // Filter by categories
//   if (categories) {
//     const categoryArray =
//       typeof categories === "string"
//         ? categories.split(",")
//         : Array.isArray(categories)
//         ? categories
//         : [categories];
//     filter.category = { $in: categoryArray };
//   }

//   // Filter by brands
//   if (brands) {
//     const brandArray =
//       typeof brands === "string"
//         ? brands.split(",")
//         : Array.isArray(brands)
//         ? brands
//         : [brands];
//     filter.brand = { $in: brandArray };
//   }

//   // filter by moduleId
//   if (moduleId) {
//     const moduleArray =
//       typeof moduleId === "string"
//         ? moduleId.split(",")
//         : Array.isArray(moduleId)
//         ? moduleId
//         : [moduleId];
//     filter.module = { $in: moduleArray };
//   }

//   if (moduleTitle) {
//     const moduleArray =
//       typeof moduleTitle === "string"
//         ? moduleTitle.split(",")
//         : Array.isArray(moduleTitle)
//         ? moduleTitle
//         : [moduleTitle];

//     const modules = await CourseModule.find({
//       moduleTitle: { $in: moduleArray.map((title) => new RegExp(title, "i")) },
//     }).select("_id");
//     filter.module = { $in: modules.map((m) => m._id) };
//   }

//   // filter by courseTitle
//   if (courseTitle) {
//     const courseArray =
//       typeof courseTitle === "string"
//         ? courseTitle.split(",")
//         : Array.isArray(courseTitle)
//         ? courseTitle
//         : [courseTitle];

//     const courses = await Product.find({
//       title: { $in: courseArray.map((title) => new RegExp(title, "i")) },
//     }).select("_id");

//     const modules = await CourseModule.find({
//       course: { $in: courses.map((c) => c._id) },
//     }).select("_id");

//     filter.module = { $in: modules.map((m) => m._id) };
//   }

//   const productQuery = new QueryBuilder(Lecture.find(filter), pQuery)
//     // .search(["name", "description"])
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const updatedProducts = await productQuery.modelQuery
//     .populate({
//       path: "module",
//       populate: { path: "course" },
//     })
//     .lean();

//   const lectures = updatedProducts?.filter(
//     (lecture) => lecture?.isDeleted !== true
//   );

//   const meta = await productQuery.countTotal();

//   return {
//     meta,
//     result: lectures,
//   };
// };

// const updateLecture = async (
//   lectureId: string,
//   lecturePdfs: IPdfFiles,
//   payload: Partial<ILecture>
// ) => {
//   const { pdfs } = lecturePdfs;
//   if (!pdfs || pdfs.length === 0) {
//     throw new AppError(StatusCodes.BAD_REQUEST, "Lecture pdfs are required.");
//   }
//   payload.pdfUrls = pdfs.map((pdf) => pdf.path);

//   const product = await Lecture.findOne({
//     _id: lectureId,
//   });

//   if (!product) {
//     throw new AppError(StatusCodes.NOT_FOUND, "Lecture Not Found");
//   }

//   return await Lecture.findByIdAndUpdate(lectureId, payload, { new: true });
// };

// const deleteLecture = async (
//   lectureId: string,
//   payload: { isDeleted?: string }
// ) => {
//   const lecture = await Lecture.findById(lectureId);

//   if (!lecture) {
//     throw new AppError(StatusCodes.NOT_FOUND, "Lecture is not found");
//   }

//   if (payload?.isDeleted === "true") {
//     lecture.isDeleted = true;
//   }

//   const updatedLecture = await lecture.save();
//   return {
//     updatedLecture,
//   };
// };

// export const LectureService = {
//   createLecture,
//   getAllLectures,
//   updateLecture,
//   deleteLecture,
// };
