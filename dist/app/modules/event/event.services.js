"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const host_model_1 = require("../host/host.model");
const event_model_1 = require("./event.model");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createEvent = async (user, payload) => {
    const session = await event_model_1.Event.startSession();
    session.startTransaction();
    try {
        const hostInfo = await host_model_1.Host.findOne({ user });
        if (!hostInfo) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not a host");
        }
        const eventPayload = {
            ...payload,
            host: hostInfo._id,
        };
        const createEventInfo = await event_model_1.Event.create([eventPayload], { session });
        await host_model_1.Host.findByIdAndUpdate(hostInfo._id, {
            events: [...hostInfo.events, createEventInfo[0]._id],
        }, { new: true, session });
        await session.commitTransaction();
        session.endSession();
        return createEventInfo;
    }
    catch (error) {
        await session.commitTransaction();
        session.endSession();
        throw error;
    }
};
const getEventById = async (eventId) => {
    const eventInfo = await event_model_1.Event.findById(eventId).populate({
        path: "host",
        select: "user approval_Status",
        populate: {
            path: "user",
            select: "name email phone picture",
        },
    });
    return eventInfo;
};
const getAllEvent = async (query) => {
    const searchTerm = query.searchTerm === "undefined" ? "" : query.searchTerm;
    const category = query.category === "undefined" ? "" : query.category;
    const location = query.location === "undefined" ? "" : query.location;
    const itemPerPage = 3;
    const page = Number(query.page);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterQuery = {};
    if (searchTerm) {
        filterQuery.title = { $regex: searchTerm, $options: "i" };
    }
    if (category) {
        filterQuery.category = category;
    }
    if (location) {
        filterQuery.location = location;
    }
    const totalEvents = await event_model_1.Event.find(filterQuery).countDocuments();
    const getAllEventInfos = await event_model_1.Event.find(filterQuery).populate({
        path: "host",
        select: "approval_Status",
        populate: {
            path: "user",
            select: "name email phone picture",
        },
    }).skip((page - 1) * itemPerPage).limit(itemPerPage).sort({ createdAt: -1 });
    return { totalEvents, events: getAllEventInfos };
};
const updateEventInfo = async (eventId, payload, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
file) => {
    const eventInfo = (await event_model_1.Event.findById(eventId));
    if (!eventInfo) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "The event info not found");
    }
    if (eventInfo.event_status === "COMPLETED") {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You can't update this event. Your event is completed");
    }
    if (file) {
        await (0, cloudinary_config_1.deleteImageFromCLoudinary)(eventInfo?.image);
        payload.image = file.path;
    }
    const updatedEventInfo = await event_model_1.Event.findByIdAndUpdate(eventId, payload, {
        new: true,
    });
    return updatedEventInfo;
};
const deleteEventInfo = async (eventId) => {
    const eventInfo = (await event_model_1.Event.findById(eventId));
    if (!eventInfo) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "The event info doesn't exist");
    }
    await (0, cloudinary_config_1.deleteImageFromCLoudinary)(eventInfo.image);
    const deletedEventInfo = await event_model_1.Event.findByIdAndDelete(eventId);
    return deletedEventInfo;
};
exports.eventServices = {
    createEvent,
    getEventById,
    getAllEvent,
    updateEventInfo,
    deleteEventInfo,
};
