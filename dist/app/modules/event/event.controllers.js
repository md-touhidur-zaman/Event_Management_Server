"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const event_services_1 = require("./event.services");
const sendResponse_1 = require("../../utils/sendResponse");
const createEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodeToken = req.user;
    const userId = decodeToken.userId;
    const result = await event_services_1.eventServices.createEvent(userId, {
        ...req.body,
        image: req.file?.path,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "The event is successfully created",
        data: result,
    });
});
const getEventById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const eventId = req.params.id;
    const result = await event_services_1.eventServices.getEventById(eventId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "The event info retrieve successfully",
        data: result,
    });
});
const getAllEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await event_services_1.eventServices.getAllEvent();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All event info retrieve successfully",
        data: result,
    });
});
const updateEventInfo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const eventId = req.params.id;
    const result = await event_services_1.eventServices.updateEventInfo(eventId, req.body, req.file);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Event info Updated successfully",
        data: result,
    });
});
const deleteEventInfo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const eventId = req.params.id;
    const result = await event_services_1.eventServices.deleteEventInfo(eventId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Event info deleted successfully",
        data: result,
    });
});
exports.eventControllers = {
    createEvent,
    getEventById,
    getAllEvent,
    updateEventInfo,
    deleteEventInfo,
};
