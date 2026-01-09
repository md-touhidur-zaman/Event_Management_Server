"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const event_model_1 = require("../event/event.model");
const bookings_model_1 = require("./bookings.model");
const getTransactionId_1 = require("../../utils/getTransactionId");
const payment_model_1 = require("../payment/payment.model");
const payment_interfaces_1 = require("../payment/payment.interfaces");
const user_model_1 = require("../user/user.model");
const sslCommerz_services_1 = require("../sslCommerz/sslCommerz.services");
const createBookings = async (payload) => {
    const transactionId = (0, getTransactionId_1.getTransactionId)();
    const session = await bookings_model_1.Bookings.startSession();
    session.startTransaction();
    try {
        const isUserExist = await user_model_1.User.findById(payload.user);
        if (!isUserExist.phone) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Please update your profile with phone number");
        }
        const eventInfo = await event_model_1.Event.findById(payload.event);
        if (!eventInfo) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "The event does not exist");
        }
        const totalAmount = eventInfo.joining_fee * payload.guestCount;
        const createBookingInfo = await bookings_model_1.Bookings.create([payload], { session });
        const payment = await payment_model_1.Payment.create([
            {
                booking: createBookingInfo[0]._id,
                payment_status: payment_interfaces_1.PAYMENT_STATUS.UNPAID,
                transactionId: transactionId,
                amount: totalAmount,
            },
        ], { session });
        const updatedBookingsInfo = await bookings_model_1.Bookings.findByIdAndUpdate(createBookingInfo[0]._id, {
            payment: payment[0]._id,
        }, { new: true, runValidators: true, session })
            .populate("user", "name email phone location")
            .populate("event")
            .populate("payment");
        const userName = updatedBookingsInfo.user.name;
        const userEmail = updatedBookingsInfo.user.email;
        const userPhone = updatedBookingsInfo.user.phone;
        const userLocation = updatedBookingsInfo.user.location;
        const sslCommerzPayload = {
            name: userName,
            email: userEmail,
            phoneNumber: userPhone,
            address: userLocation,
            transactionId,
            amount: totalAmount,
        };
        const sslPayment = await sslCommerz_services_1.sslCommerzServices.initPayment(sslCommerzPayload);
        await session.commitTransaction();
        await session.endSession();
        return {
            bookings: updatedBookingsInfo,
            paymentUrl: sslPayment.GatewayPageURL
        };
    }
    catch (error) {
        await session.commitTransaction();
        session.endSession();
        throw error;
    }
};
const getMyBookings = async (userId, params) => {
    const itemPerPage = 3;
    const page = Number(params.page);
    const totalBookings = await bookings_model_1.Bookings.find({ user: userId }).countDocuments();
    const result = await bookings_model_1.Bookings.find({ user: userId })
        .populate("user", "name email phone")
        .populate({
        path: "event",
        populate: {
            path: "host",
            select: "user approval_Status",
            populate: {
                path: "user",
                select: "name email phone picture"
            }
        }
    })
        .populate("payment").sort({ createdAt: -1 }).skip((page - 1) * itemPerPage).limit(itemPerPage);
    return { totalBookings, events: result };
};
const getBookingsByEventId = async (eventId) => {
    const bookingEventInfo = await bookings_model_1.Bookings.find({ event: eventId }).populate("user", "name email phone").populate("payment", "amount payment_status transactionId");
    return bookingEventInfo;
};
exports.BookingServices = {
    createBookings,
    getMyBookings,
    getBookingsByEventId
};
