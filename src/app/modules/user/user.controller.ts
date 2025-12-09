import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userServices } from "./user.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"



const createUser = catchAsync(async(req: Request, res: Response)=>{
    const payload = req.body 

    const result = await userServices.createUser(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Created Successfully",
        data: result
    })

})


export const userControllers = {
    createUser
}