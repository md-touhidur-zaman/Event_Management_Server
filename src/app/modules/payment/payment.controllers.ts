import  httpStatusCode  from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentServices } from "./payment.services";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";



const initPayment = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.id
  
  const paymentURL = await paymentServices.initPayment(bookingId)

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "New Payment Url get successfully.",
    data:{
        paymentURL
    }
  })
});


const successPayment = catchAsync(async(req:Request, res: Response)=>{
    const result = await paymentServices.successPayment(req.query as Record<string, string>)
    if(result.success){
        res.redirect(`${envVars.SSL.SSL_COMMERZ_FRONTEND_SUCCESS_URL}?transitionId=${result.data.transitionId}&payment_status=${result.data.payment_status}&amount=${result.data.amount}`)
    }
})

const cancelPayment = catchAsync(async(req:Request, res: Response)=>{
    const result = await paymentServices.cancelPayment(req.query as Record<string, string>)

    if(!result.success){
        res.redirect(`${envVars.SSL.SSL_COMMERZ_FRONTEND_CANCEL_URL}?payment_status=${result.data.payment_status}&amount=${result.data.amount}`)
    }
    
})

const failedPayment = catchAsync(async(req:Request, res: Response)=>{
    const result = await paymentServices.failedPayment(req.query as Record<string, string>)

    if(!result.success){
        res.redirect(`${envVars.SSL.SSL_COMMERZ_FRONTEND_FAILED_URL}?payment_status=${result.data.payment_status}&amount=${result.data.amount}`)
    }
    
})

export const paymentControllers = {
    successPayment,
    cancelPayment,
    failedPayment,
    initPayment
}