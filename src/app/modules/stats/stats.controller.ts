import  httpStatusCode  from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { StatsServices } from "./stats.services";
import { sendResponse } from "../../utils/sendResponse";

const getUserStats = catchAsync(async(req:Request, res:Response)=>{
    const decodedToken = req.user as JwtPayload
    const userId = decodedToken.userId 

    const result = await StatsServices.getUserStats(userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Stats get successfully",
        data: result
    })
})
const getHostStats = catchAsync(async(req:Request, res:Response)=>{
    const decodedToken = req.user as JwtPayload
    const userId = decodedToken.userId 

    const result = await StatsServices.getHostStats(userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Host Stats get successfully",
        data: result
    })
})
const getAdminStats = catchAsync(async(req:Request, res:Response)=>{
   

    const result = await StatsServices.getAdminStats()
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Admin Stats get successfully",
        data: result
    })
})


export const StatsControllers ={
    getUserStats,
    getHostStats,
    getAdminStats
}