import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentServices } from "./payment.services";
import { envVars } from "../../config/env";

const successPayment = catchAsync(async(req:Request, res: Response)=>{
    const result = await paymentServices.successPayment(req.query as Record<string, string>)

    if(result){
        res.redirect(`${envVars.SSL.SSL_COMMERZ_FRONTEND_SUCCESS_URL}?transitionId=${result.data.transitionId}&payment_status=${result.data.payment_status}&amount=${result.data.amount}`)
    }
    
})

export const paymentControllers = {
    successPayment
}