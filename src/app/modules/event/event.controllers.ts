import  httpStatusCode  from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { eventServices } from "./event.services";
import { sendResponse } from "../../utils/sendResponse";

const createEvent = catchAsync(async(req:Request, res: Response)=>{
    const decodeToken = req.user as JwtPayload
    const userId = decodeToken.userId 

    const result = await eventServices.createEvent(userId, {
        ...req.body,
        image: req.file?.path
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.CREATED,
        message: "The event is successfully created",
        data: result

    })
})

export const eventControllers = {
    createEvent
}

