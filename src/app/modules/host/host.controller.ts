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



const updateHostRole = catchAsync(async(req: Request, res:Response) =>{
    const hostId = req.params.id 
    const {approval_Status} = req.body 

    const result = await hostServices.updateHostRole(hostId, approval_Status)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: `The request is ${result.approval_Status}`,
        data: result
    })
})

const getAllPublishedEvents = catchAsync(async(req:Request, res:Response)=>{
    const decodedToken = req.user as JwtPayload
    const userId = decodedToken.userId
    const query = req.query 
   
    const result = await hostServices.getAllPublishedEvents(userId, query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Your All Published Events Retrieve Successfully",
        data: result 
    }) 
})

const getRequestedBecomeAHost = catchAsync(async(req:Request, res:Response)=>{
    
    const result = await hostServices.getRequestedBecomeAHost()

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Requested become a hosts info retrieve successfully",
        data: result 
    }) 
})

export  const HostControllers = {
    requestBecomeHost,
    updateHostRole,
    getAllPublishedEvents,
    getRequestedBecomeAHost
}