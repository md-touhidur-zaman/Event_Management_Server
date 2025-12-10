import httpStatusCode  from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from 'jsonwebtoken';
import { IApproval_Status, IHost } from './host.interfaces';
import { hostServices } from './host.services';

const requestBecomeHost = catchAsync(async(req:Request, res:Response)=>{
    const decodedToken = req.user as JwtPayload

    const userId =await decodedToken?.userId 

    const becomeAHostPayload: Partial<IHost>= {
        user: userId,
        approval_Status: IApproval_Status.PENDING
    }

    const result = await hostServices.requestBecomeHost(becomeAHostPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Your request become a host is successfully requested",
        data: result
    })
})

export  const HostControllers = {
    requestBecomeHost
}