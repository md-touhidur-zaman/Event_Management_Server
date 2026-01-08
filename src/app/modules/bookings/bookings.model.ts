import { model, Schema } from "mongoose";
import { BOOKING_STATUS, IBooking } from "./bookings.interfaces";

const bookingsSchema = new Schema<IBooking>({
    user: {type: Schema.Types.ObjectId, required: true, ref: "User"},
    event: {type: Schema.Types.ObjectId, required: true, ref: "Event"},
    payment: {type: Schema.Types.ObjectId,ref: "Payment"},
    status: {type: String, enum: Object.values(BOOKING_STATUS), default: BOOKING_STATUS.PENDING},
    guestCount: {type: Number, required: true}
}, {timestamps: true})

export const Bookings = model<IBooking>("Bookings", bookingsSchema)