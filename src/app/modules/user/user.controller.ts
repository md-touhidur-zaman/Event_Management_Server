import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userServices } from "./user.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  // payload.interests = await payload?.interests.split(",");

  const result = await userServices.createUser(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.CREATED,
    message: "User Created Successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getAllUser();

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "All user's info retrieve successfully",
    data: result,
  });
});
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await userServices.getUserById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "User info retrieve successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user;
  const userId = decodedToken.userId;

  const updatedDoc = req.body;

//   const { password, ...rest } = updatedDoc;

//   if (password === "") {
//     updatedDoc = rest;
//   }

  const result = await userServices.updateUser(userId, updatedDoc);

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "You successfully updated your profile",
    data: result,
  });
});

export const userControllers = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
};
