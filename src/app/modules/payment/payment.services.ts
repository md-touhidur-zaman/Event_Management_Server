import { BOOKING_STATUS } from "../bookings/bookings.interfaces";
import { Bookings } from "../bookings/bookings.model";
import { PAYMENT_STATUS } from "./payment.interfaces";
import { Payment } from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
  const session = await Payment.startSession();
  session.startTransaction();
  try {
    const updatedPaymentInfo = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { payment_status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session }
    );

    const updatedBookingInfo = await Bookings.findOneAndUpdate(
      { payment: updatedPaymentInfo._id },
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session }
    )

    await session.commitTransaction()
    session.endSession()

    return updatedBookingInfo
  } catch (error) {
    await session.commitTransaction()
    session.endSession()
    throw error
  }
}


export const paymentServices = {
    successPayment
}
