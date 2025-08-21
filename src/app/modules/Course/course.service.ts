import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/appError";
import { IImageFile } from "../../interface/IImageFile";
import { Review } from "../review/review.model";
import { IProduct } from "./course.interface";
import { Product } from "./course.model";
// authUser: IJwtPayload
// if (!images || images.length === 0) {
//   throw new AppError(StatusCodes.BAD_REQUEST, "Product images are required.");
// }

// console.log("images", images);
const createProduct = async (
  productData: Partial<IProduct>,
  file: IImageFile
) => {
  if (file && file.path) {
    productData.thumbnail = file.path;
  }

  const { ...rest } = productData;

  const newProduct = new Product({
    ...rest,
  });

  console.log({ newProduct: newProduct, productData: productData });

  const result = await newProduct.save();
  return result;
};

const getAllProduct = async (query: Record<string, unknown>) => {
  const { ...pQuery } = query;

  // Build the filter object
  const filter: Record<string, any> = {};

  const productQuery = new QueryBuilder(Product.find(filter), pQuery)
    // .search(["name", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const updatedProducts = await productQuery.modelQuery.lean();
  const courses = updatedProducts?.filter(
    (course) => course?.isDeleted !== true
  );
  const meta = await productQuery.countTotal();

  return {
    meta,
    result: courses,
  };
};

const getSingleProduct = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }

  if (!product.isActive) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Product is not active");
  }

  // const offerPrice = await product.calculateOfferPrice();
  const reviews = await Review.find({ product: product._id });

  const productObj = product.toObject();

  return {
    ...productObj,
    // offerPrice,
    reviews,
  };
};

const updateProduct = async (
  productId: string,
  payload: Partial<IProduct>,
  file: IImageFile
) => {
  if (file && file.path) {
    payload.thumbnail = file.path;
  }

  const product = await Product.findOne({
    _id: productId,
  });

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product Not Found");
  }

  return await Product.findByIdAndUpdate(productId, payload, { new: true });
};

const deleteProduct = async (
  productId: string,
  payload: { isDeleted?: string }
) => {
  const product = await Product.findOne({
    _id: productId,
  });

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product Not Found");
  }

  if (payload?.isDeleted === "true") {
    product.isDeleted = true;
  }

  const updatedProduct = await product.save();
  return {
    updatedProduct,
  };
};

export const ProductService = {
  createProduct,
  getAllProduct,

  getSingleProduct,
  updateProduct,
  deleteProduct,
};
