"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bookings = void 0;
const mongoose_1 = require("mongoose");
const bookings_interfaces_1 = require("./bookings.interfaces");
const bookingsSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    event: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Event" },
    payment: { type: mongoose_1.Schema.Types.ObjectId, ref: "Payment" },
    status: { type: String, enum: Object.values(bookings_interfaces_1.BOOKING_STATUS), default: bookings_interfaces_1.BOOKING_STATUS.PENDING },
    guestCount: { type: Number, required: true }
}, { timestamps: true });
exports.Bookings = (0, mongoose_1.model)("Bookings", bookingsSchema);
