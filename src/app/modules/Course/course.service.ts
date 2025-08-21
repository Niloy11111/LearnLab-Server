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

// const getAllProduct = async (query: Record<string, unknown>) => {
//    const { minPrice, maxPrice, ...pQuery } = query;

//    const productQuery = new QueryBuilder(
//       Product.find()
//          .populate('category', 'name')
//          .populate('shop', 'shopName')
//          .populate('brand', 'name'),
//       pQuery
//    )
//       .search(['name', 'description'])
//       .filter()
//       .sort()
//       .paginate()
//       .fields()
//       .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

//    const products = await productQuery.modelQuery.lean();

//    const meta = await productQuery.countTotal();

//    const productIds = products.map((product: any) => product._id);

//    const flashSales = await FlashSale.find({
//       product: { $in: productIds },
//       discountPercentage: { $gt: 0 },
//    }).select('product discountPercentage');

//    const flashSaleMap = flashSales.reduce((acc, { product, discountPercentage }) => {
//       //@ts-ignore
//       acc[product.toString()] = discountPercentage;
//       return acc;
//    }, {});

//    const updatedProducts = products.map((product: any) => {
//       //@ts-ignore
//       const discountPercentage = flashSaleMap[product._id.toString()];
//       if (discountPercentage) {
//          product.offerPrice = product.price * (1 - discountPercentage / 100);
//       } else {
//          product.offerPrice = null;
//       }
//       return product;
//    });

//    return {
//       meta,
//       result: updatedProducts,
//    };
// };

// Product.service.ts

const getAllProduct = async (query: Record<string, unknown>) => {
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

  // Filter by in stock/out of stock
  if (inStock !== undefined) {
    filter.stock = inStock === "true" ? { $gt: 0 } : 0;
  }

  // Filter by ratings
  if (ratings) {
    const ratingArray =
      typeof ratings === "string"
        ? ratings.split(",")
        : Array.isArray(ratings)
        ? ratings
        : [ratings];
    filter.averageRating = { $in: ratingArray.map(Number) };
  }

  if (location) {
    filter.$or = [
      { "location.address": { $regex: location, $options: "i" } },
      { "location.city": { $regex: location, $options: "i" } },
      { "location.state": { $regex: location, $options: "i" } },
      { "location.country": { $regex: location, $options: "i" } },
    ];
  }

  // console.log("filter", filter);
  // console.log("pquery", pQuery);

  const productQuery = new QueryBuilder(Product.find(filter), pQuery)
    // .search(["name", "description"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

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
