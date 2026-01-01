"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bookings_interfaces_1 = require("../bookings/bookings.interfaces");
const bookings_model_1 = require("../bookings/bookings.model");
const payment_interfaces_1 = require("./payment.interfaces");
const payment_model_1 = require("./payment.model");
const event_model_1 = require("../event/event.model");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const sslCommerz_services_1 = require("../sslCommerz/sslCommerz.services");
const initPayment = async (bookingId) => {
    const isPaymentExist = await payment_model_1.Payment.findOne({ booking: bookingId });
    if (!isPaymentExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment Does not exist.");
    }
    if (isPaymentExist.payment_status === payment_interfaces_1.PAYMENT_STATUS.PAID) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your already pay for this ride");
    }
    const bookingInfo = await bookings_model_1.Bookings.findById(bookingId)
        .populate("user", "name email phone location")
        .populate("event")
        .populate("payment");
    const sslCommerzPayload = {
        amount: (bookingInfo?.payment).amount,
        transactionId: (bookingInfo?.payment).transactionId,
        name: (bookingInfo?.user).name,
        email: (bookingInfo?.user).email,
        phoneNumber: (bookingInfo?.user).phone,
        address: (bookingInfo?.user).location
    };
    const sslPaymentInfo = await sslCommerz_services_1.sslCommerzServices.initPayment(sslCommerzPayload);
    return sslPaymentInfo.GatewayPageURL;
};
const successPayment = async (query) => {
    const session = await payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const updatedPaymentInfo = await payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { payment_status: payment_interfaces_1.PAYMENT_STATUS.PAID }, { new: true, runValidators: true, session });
        const updatedBookingsInfo = await bookings_model_1.Bookings.findOneAndUpdate({ payment: updatedPaymentInfo._id }, { status: bookings_interfaces_1.BOOKING_STATUS.COMPLETE }, { new: true, runValidators: true, session });
        const eventInfo = await event_model_1.Event.findById(updatedBookingsInfo?.event);
        const newTotalNumberOfBooking = eventInfo.total_no_of_booking + updatedBookingsInfo.guestCount;
        await event_model_1.Event.findByIdAndUpdate(updatedBookingsInfo?.event, { total_no_of_booking: newTotalNumberOfBooking });
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
    }
    catch (error) {
        await session.commitTransaction();
        session.endSession();
        throw error;
    }
};
const cancelPayment = async (query) => {
    const session = await payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const updatedPaymentInfo = await payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { payment_status: payment_interfaces_1.PAYMENT_STATUS.CANCELLED }, { new: true, runValidators: true, session });
        await bookings_model_1.Bookings.findOneAndUpdate({ payment: updatedPaymentInfo._id }, { status: bookings_interfaces_1.BOOKING_STATUS.CANCEL }, { new: true, runValidators: true, session });
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
    }
    catch (error) {
        await session.commitTransaction();
        session.endSession();
        throw error;
    }
};
const failedPayment = async (query) => {
    const session = await payment_model_1.Payment.startSession();
    session.startTransaction();
    try {
        const updatedPaymentInfo = await payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, { payment_status: payment_interfaces_1.PAYMENT_STATUS.FAILED }, { new: true, runValidators: true, session });
        await bookings_model_1.Bookings.findOneAndUpdate({ payment: updatedPaymentInfo._id }, { status: bookings_interfaces_1.BOOKING_STATUS.FAILED }, { new: true, runValidators: true, session });
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
    }
    catch (error) {
        await session.commitTransaction();
        session.endSession();
        throw error;
    }
};
exports.paymentServices = {
    successPayment,
    cancelPayment,
    failedPayment,
    initPayment
};
