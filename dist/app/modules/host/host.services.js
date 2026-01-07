"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const host_interfaces_1 = require("./host.interfaces");
const host_model_1 = require("./host.model");
const event_model_1 = require("../event/event.model");
const requestBecomeHost = async (payload) => {
    const hostInfo = await host_model_1.Host.create(payload);
    return hostInfo;
};
const updateHostRole = async (hostId, approval_Status) => {
    const updatedHostInfo = await (await host_model_1.Host.findByIdAndUpdate(hostId, { approval_Status }, { new: true })).populate("user", "name email phone");
    if (updatedHostInfo.approval_Status === host_interfaces_1.IApproval_Status.ACCEPTED) {
        await user_model_1.User.findByIdAndUpdate(updatedHostInfo.user, { role: user_interface_1.IRole.HOST });
    }
    return updatedHostInfo;
};
const getAllPublishedEvents = async (userId, query) => {
    const searchTerm = query.searchTerm === "undefined" ? "" : query.searchTerm;
    const status = query.status === "undefined" ? "" : query.status;
    const sortBy = query.sortBy === "undefined" ? "dsc" : query.sortBy;
    const itemPerPage = 3;
    const page = Number(query.page);
    const host = await host_model_1.Host.findOne({ user: userId });
    if (!host) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "The host doesn't exist");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterQuery = {
        host: host._id
    };
    if (searchTerm) {
        filterQuery.title = { $regex: searchTerm, $options: "i" };
    }
    if (status) {
        filterQuery.event_status = status;
    }
    const totalEvents = await event_model_1.Event.find(filterQuery).countDocuments();
    const events = await event_model_1.Event.find(filterQuery).sort({ createdAt: sortBy === "asc" ? 1 : -1 }).skip((page - 1) * itemPerPage).limit(itemPerPage);
    return { totalEvents, events };
};
exports.hostServices = {
    requestBecomeHost,
    updateHostRole,
    getAllPublishedEvents,
};
