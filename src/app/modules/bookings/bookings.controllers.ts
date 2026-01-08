import  httpStatusCode  from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from 'jsonwebtoken';
import { BookingServices } from './bookings.services';

const createBookings = catchAsync(async(req:Request, res:Response)=>{

    const decodedToken = req.user as JwtPayload
    const userId = decodedToken.userId



    const bookingsPayload = {
        ...req.body,
        user: userId
    }
    
    const result = await BookingServices.createBookings(bookingsPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "You have successfully complete your bookings.",
        data: result
    })
})


const getMyBookings = catchAsync(async(req:Request, res:Response)=>{
    const decodedToken = req.user as JwtPayload

    const userId = decodedToken.userId

    const result = await BookingServices.getMyBookings(userId, req.query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Your all bookings info retrieve successfully",
        data: result
    })
})


export const bookingsControllers = {
    createBookings,
    getMyBookings
}