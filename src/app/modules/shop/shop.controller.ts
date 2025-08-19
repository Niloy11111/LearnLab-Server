import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IImageFile } from "../../interface/IPdfFile";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IJwtPayload } from "../auth/auth.interface";
import { ShopService } from "./shop.service";

const createShop = catchAsync(async (req: Request, res: Response) => {
  const result = await ShopService.createShop(
    req.body,
    req.file as IImageFile,
    req.user as IJwtPayload
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Shop created successfully!",
    data: result,
  });
});

const getMyShop = catchAsync(async (req: Request, res: Response) => {
  const result = await ShopService.getMyShop(req.user as IJwtPayload);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shop retrive successfully!",
    data: result,
  });
});

export const ShopController = {
  createShop,
  getMyShop,
};
