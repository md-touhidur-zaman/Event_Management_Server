"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingsControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const bookings_services_1 = require("./bookings.services");
const createBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const bookingsPayload = {
        ...req.body,
        user: userId
    };
    const result = await bookings_services_1.BookingServices.createBookings(bookingsPayload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "You have successfully complete your bookings.",
        data: result
    });
});
const getMyBookings = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const result = await bookings_services_1.BookingServices.getMyBookings(userId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Your all bookings info retrieve successfully",
        data: result
    });
});
const getBookingsByEventId = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const eventId = req.params.eventId;
    const result = await bookings_services_1.BookingServices.getBookingsByEventId(eventId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All Participants retrieve successfully",
        data: result
    });
});
exports.bookingsControllers = {
    createBookings,
    getMyBookings,
    getBookingsByEventId
};
