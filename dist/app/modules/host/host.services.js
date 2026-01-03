"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostServices = void 0;
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const host_interfaces_1 = require("./host.interfaces");
const host_model_1 = require("./host.model");
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
const getAllPublishedEvents = async (userId) => {
    const allPublishedEvents = await host_model_1.Host.findOne({ user: userId }).populate("events");
    return allPublishedEvents;
};
exports.hostServices = {
    requestBecomeHost,
    updateHostRole,
    getAllPublishedEvents
};
