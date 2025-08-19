import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IPdfFiles } from "../../interface/IPdfFile";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { LectureService } from "./lecture.service";

const createLecture = catchAsync(async (req: Request, res: Response) => {
  const result = await LectureService.createLecture(
    req.body,
    req.files as IPdfFiles
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Lecture has been created successfully",
    data: result,
  });
});

const getAllLectures = catchAsync(async (req, res) => {
  // const moduleId = req.params?.moduleId;

  const result = await LectureService.getAllLectures(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Lectures are retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const updateLecture = catchAsync(async (req, res) => {
  const {
    body: payload,
    params: { lectureId },
  } = req;

  console.log("lectureId", lectureId, req.files);

  const result = await LectureService.updateLecture(
    lectureId,
    req.files as IPdfFiles,
    payload
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Lecture updated successfully",
    data: result,
  });
});

const deleteLecture = catchAsync(async (req, res) => {
  const lectureId = req.params.lectureId;
  const result = await LectureService.deleteLecture(lectureId, req.body);

  console.log("lecture dsfsd", lectureId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Lecture has been deleted`,
    data: result,
  });
});

export const LectureController = {
  createLecture,
  getAllLectures,
  updateLecture,
  deleteLecture,
};
