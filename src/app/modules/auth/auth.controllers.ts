import  httpStatusCode  from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authServices } from './auth.services';

const credentialsLogin = catchAsync(
  async (req: Request, res: Response) => {

    const loginInfo = await authServices.credentialsLogin(req.body);
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "The user login successfully...",
      data: loginInfo,
    });
  }
);

export const authControllers = {
    credentialsLogin
}