/* eslint-disable @typescript-eslint/no-explicit-any */
import  httpStatusCode  from 'http-status-codes';
import { BOOKING_STATUS } from "../bookings/bookings.interfaces";
import { Bookings } from "../bookings/bookings.model";
import { PAYMENT_STATUS } from "./payment.interfaces";
import { Payment } from "./payment.model";
import { Event } from '../event/event.model';
import AppError from "../../errorHelpers/appError";
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interfaces';
import { sslCommerzServices } from '../sslCommerz/sslCommerz.services';


const initPayment = async(bookingId: string) =>{
 

  const isPaymentExist = await Payment.findOne({booking:bookingId})
  
  if(!isPaymentExist){
    throw new AppError(httpStatusCode.BAD_REQUEST, "Payment Does not exist.")
  }

  if (isPaymentExist.payment_status === PAYMENT_STATUS.PAID){
    throw new AppError(httpStatusCode.BAD_REQUEST, "Your already pay for this ride")
  }



  const bookingInfo = await Bookings.findById(bookingId)
    .populate("user", "name email phone location")
    .populate("event")
    .populate("payment");

  const sslCommerzPayload: ISSLCommerz = {
        amount: (bookingInfo?.payment as any).amount,
        transactionId: (bookingInfo?.payment as any).transactionId,
        name: (bookingInfo?.user as any).name,
        email: (bookingInfo?.user as any).email,
        phoneNumber: (bookingInfo?.user as any).phone,
        address: (bookingInfo?.user as any).location
        
      };



  const sslPaymentInfo = await sslCommerzServices.initPayment(
        sslCommerzPayload
      ); 


  return sslPaymentInfo.GatewayPageURL
  

}




const successPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const updatedPaymentInfo = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { payment_status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session }
    );


    const updatedBookingsInfo =await Bookings.findOneAndUpdate(
      { payment: updatedPaymentInfo._id },
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session }
    );

    const eventInfo = await Event.findById(updatedBookingsInfo?.event)

    const newTotalNumberOfBooking = eventInfo.total_no_of_booking + updatedBookingsInfo.guestCount

    await Event.findByIdAndUpdate(updatedBookingsInfo?.event, {total_no_of_booking: newTotalNumberOfBooking})

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Payment successfully completed.",
      data: {
        transitionId: updatedPaymentInfo?.transactionId,
        payment_status: updatedPaymentInfo?.payment_status,
        amount: updatedPaymentInfo?.amount,
      },
    };
  } catch (error) {
    await session.commitTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const updatedPaymentInfo = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { payment_status: PAYMENT_STATUS.CANCELLED },
      { new: true, runValidators: true, session }
    );

    await Bookings.findOneAndUpdate(
      { payment: updatedPaymentInfo._id },
      { status: BOOKING_STATUS.CANCEL },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment canceled",
      data: {
        payment_status: updatedPaymentInfo?.payment_status,
        amount: updatedPaymentInfo?.amount,
      },
    };
  } catch (error) {
    await session.commitTransaction();
    session.endSession();
    throw error;
  }
};

const failedPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const updatedPaymentInfo = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { payment_status: PAYMENT_STATUS.FAILED },
      { new: true, runValidators: true, session }
    );

    await Bookings.findOneAndUpdate(
      { payment: updatedPaymentInfo._id },
      { status: BOOKING_STATUS.FAILED },
      { new: true, runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      success: false,
      message: "Payment failed",
      data: {
        payment_status: updatedPaymentInfo?.payment_status,
        amount: updatedPaymentInfo?.amount,
      },
    };
  } catch (error) {
    await session.commitTransaction();
    session.endSession();
    throw error;
  }
};

export const paymentServices = {
  successPayment,
  cancelPayment,
  failedPayment,
  initPayment
};
