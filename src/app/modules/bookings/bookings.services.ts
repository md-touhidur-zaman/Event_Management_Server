/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatusCode from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { Event } from "../event/event.model";
import { IBooking } from "./bookings.interfaces";
import { Bookings } from "./bookings.model";
import { getTransactionId } from "../../utils/getTransactionId";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interfaces";
import { User } from "../user/user.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interfaces";
import { sslCommerzServices } from "../sslCommerz/sslCommerz.services";

const createBookings = async (payload: Partial<IBooking>) => {
 
  const transactionId = getTransactionId();
  const session = await Bookings.startSession();
  session.startTransaction();
  try {

    const isUserExist = await User.findById(payload.user)

    if(!isUserExist.phone){
        throw new AppError(httpStatusCode.NOT_FOUND, "Please update your profile with phone number")
    }
    const eventInfo = await Event.findById(payload.event);

    if (!eventInfo) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        "The event does not exist"
      );
    }



    const totalAmount = eventInfo.joining_fee * payload.guestCount;

    const createBookingInfo = await Bookings.create([payload], { session });

    const payment = await Payment.create(
      [
        {
          booking: createBookingInfo[0]._id,
          payment_status: PAYMENT_STATUS.UNPAID,
          transactionId: transactionId,
          amount: totalAmount,
        },
      ],
      { session }
    );

    const updatedBookingsInfo = await Bookings.findByIdAndUpdate(
      createBookingInfo[0]._id,
      {
        payment: payment[0]._id,
      },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone location")
      .populate("event")
      .populate("payment")
    
    const userName = (updatedBookingsInfo.user as any).name
    const userEmail = (updatedBookingsInfo.user as any).email
    const userPhone = (updatedBookingsInfo.user as any).phone
    const userLocation = (updatedBookingsInfo.user as any).location


    const sslCommerzPayload: ISSLCommerz = {
        name: userName,
        email: userEmail,
        phoneNumber: userPhone,
        address: userLocation,
        transactionId,
        amount: totalAmount,
    }
    
    const sslPayment = await sslCommerzServices.initPayment(sslCommerzPayload)
    

    await session.commitTransaction();
    await session.endSession();

    
 
    return {
      bookings: updatedBookingsInfo,
      paymentUrl: sslPayment.GatewayPageURL
    };
  } catch (error) {
    await session.commitTransaction();
    session.endSession();
    throw error;
  }
};

const getMyBookings = async(userId: string, params:Record<string, string>) =>{
  const itemPerPage = 4
  const page = Number(params.page)
  const totalBookings = await Bookings.find({user: userId}).countDocuments()
  const result = await Bookings.find({user: userId})
  .populate("user", "name email phone")
  .populate({
    path:"event",
    populate: {
      path:"host",
      select: "user approval_Status",
      populate:{
        path: "user",
        select: "name email phone picture"
      }
    }
  })
  .populate("payment").sort({ createdAt: -1 }).skip((page-1)*itemPerPage).limit(itemPerPage)

  return {totalBookings,events:result} 
}

const getBookingsByEventId = async(eventId: string) =>{
  const bookingEventInfo = await Bookings.find({event: eventId}).populate("user", "name email phone").populate("payment", "amount payment_status transactionId")

  return bookingEventInfo
}





export const BookingServices = {
    createBookings,
    getMyBookings,
    getBookingsByEventId
}