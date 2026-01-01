"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const payment_services_1 = require("./payment.services");
const env_1 = require("../../config/env");
const sendResponse_1 = require("../../utils/sendResponse");
const initPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const bookingId = req.params.id;
    const paymentURL = await payment_services_1.paymentServices.initPayment(bookingId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "New Payment Url get successfully.",
        data: {
            paymentURL
        }
    });
});
const successPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await payment_services_1.paymentServices.successPayment(req.query);
    if (result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_COMMERZ_FRONTEND_SUCCESS_URL}?transitionId=${result.data.transitionId}&payment_status=${result.data.payment_status}&amount=${result.data.amount}`);
    }
});
const cancelPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await payment_services_1.paymentServices.cancelPayment(req.query);
    if (!result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_COMMERZ_FRONTEND_CANCEL_URL}?payment_status=${result.data.payment_status}&amount=${result.data.amount}`);
    }
});
const failedPayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await payment_services_1.paymentServices.failedPayment(req.query);
    if (!result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_COMMERZ_FRONTEND_FAILED_URL}?payment_status=${result.data.payment_status}&amount=${result.data.amount}`);
    }
});
exports.paymentControllers = {
    successPayment,
    cancelPayment,
    failedPayment,
    initPayment
};
