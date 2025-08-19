import { StatusCodes } from "http-status-codes";
import { Product } from "../Course/course.model";
import { ICourseModule } from "./course-module.interface";

import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/appError";
import CourseModule from "./course-module.model";

const createCourseModule = async (
  payload: ICourseModule
): Promise<ICourseModule> => {
  const course = await Product.findById(payload?.course);

  if (!course) {
    throw new AppError(StatusCodes.NOT_FOUND, "This course is not found!");
  }

  // console.log(payload);

  const courseModule = await CourseModule.create(payload);
  return courseModule;
};

const getAllCourseModules = async (
  courseId: string,
  query: Record<string, unknown>
) => {
  const {
    minPrice,
    maxPrice,
    minSquareFeet,
    maxSquareFeet,
    categories,
    brands,
    inStock,
    ratings,
    location,
    ...pQuery
  } = query;

  // Build the filter object
  const filter: Record<string, any> = {};

  // Filter by categories
  if (categories) {
    const categoryArray =
      typeof categories === "string"
        ? categories.split(",")
        : Array.isArray(categories)
        ? categories
        : [categories];
    filter.category = { $in: categoryArray };
  }

  // Filter by brands
  if (brands) {
    const brandArray =
      typeof brands === "string"
        ? brands.split(",")
        : Array.isArray(brands)
        ? brands
        : [brands];
    filter.brand = { $in: brandArray };
  }

  // filter by courseId
  if (courseId) {
    const courseArray =
      typeof courseId === "string"
        ? courseId.split(",")
        : Array.isArray(courseId)
        ? courseId
        : [courseId];
    filter.course = { $in: courseArray };
  }

  // console.log("filter", filter);
  // console.log("pquery", pQuery);

  const productQuery = new QueryBuilder(CourseModule.find(filter), pQuery)
    // .search(["name", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const updatedProducts = await productQuery.modelQuery.lean();

  const modules = updatedProducts?.filter(
    (module) => module?.isDeleted !== true
  );

  const meta = await productQuery.countTotal();

  return {
    meta,
    result: modules,
  };
};

const updateCourseModule = async (
  moduleId: string,
  payload: Partial<ICourseModule>
) => {
  const module = await CourseModule.findOne({
    _id: moduleId,
  });

  console.log("moduleId skdfskfj", moduleId);
  console.log("moduleId result", module);

  if (!module) {
    throw new AppError(StatusCodes.NOT_FOUND, "Module Not Found");
  }
  console.log("payload", payload);

  return await CourseModule.findByIdAndUpdate(moduleId, payload, {
    new: true,
  });
};

const deleteCourseModule = async (
  moduleId: string,
  payload: { isDeleted?: string }
) => {
  const module = await CourseModule.findById(moduleId);

  if (!module) {
    throw new AppError(StatusCodes.NOT_FOUND, "Module is not found");
  }

  if (payload?.isDeleted === "true") {
    module.isDeleted = true;
  }

  const updatedModule = await module.save();
  return {
    updatedModule,
  };
};

export const CourseModuleService = {
  createCourseModule,
  getAllCourseModules,
  updateCourseModule,
  deleteCourseModule,
};
