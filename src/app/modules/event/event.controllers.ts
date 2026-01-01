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

const getEventById = catchAsync(async(req:Request, res:Response)=>{
    const eventId = req.params.id
    const result = await eventServices.getEventById(eventId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "The event info retrieve successfully",
        data: result
    })
})

const getAllEvent = catchAsync(async(req:Request, res:Response)=>{
   
    const result = await eventServices.getAllEvent()
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "All event info retrieve successfully",
        data: result
    })
})
const updateEventInfo = catchAsync(async(req:Request, res:Response)=>{
   const eventId = req.params.id
    const result = await eventServices.updateEventInfo(eventId, req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Event info Updated successfully",
        data: result
    })
})
const deleteEventInfo = catchAsync(async(req:Request, res:Response)=>{
   const eventId = req.params.id
    const result = await eventServices.deleteEventInfo(eventId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Event info deleted successfully",
        data: result
    })
})

export const eventControllers = {
    createEvent,
    getEventById,
    getAllEvent,
    updateEventInfo,
    deleteEventInfo
}

