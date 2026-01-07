"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const host_interfaces_1 = require("./host.interfaces");
const host_services_1 = require("./host.services");
const requestBecomeHost = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const userId = await decodedToken?.userId;
    const becomeAHostPayload = {
        user: userId,
        approval_Status: host_interfaces_1.IApproval_Status.PENDING
    };
    const result = await host_services_1.hostServices.requestBecomeHost(becomeAHostPayload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Your request become a host is successfully requested",
        data: result
    });
});
const updateHostRole = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const hostId = req.params.id;
    const { approval_Status } = req.body;
    const result = await host_services_1.hostServices.updateHostRole(hostId, approval_Status);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: `The request is ${result.approval_Status}`,
        data: result
    });
});
const getAllPublishedEvents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const query = req.query;
    const result = await host_services_1.hostServices.getAllPublishedEvents(userId, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Your All Published Events Retrieve Successfully",
        data: result
    });
});
exports.HostControllers = {
    requestBecomeHost,
    updateHostRole,
    getAllPublishedEvents
};
