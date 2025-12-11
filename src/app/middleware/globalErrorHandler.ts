import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import { deleteImageFromCLoudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let status_code = 500;
  let message = "Something went wrong....";


  if (req.file) {
        await deleteImageFromCLoudinary(req.file.path)
    }



  if (err instanceof AppError) {
    status_code = err.status_code;
    message = err.message;
  } else if(err instanceof Error) {
    status_code = 500;
    message = err.message;
  }

  

  res.status(status_code).json({
    success: false,
    status_code,
    message,
    err,
  });
};
