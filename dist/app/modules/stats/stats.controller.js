"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const stats_services_1 = require("./stats.services");
const sendResponse_1 = require("../../utils/sendResponse");
const getUserStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const result = await stats_services_1.StatsServices.getUserStats(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Stats get successfully",
        data: result
    });
});
const getHostStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const result = await stats_services_1.StatsServices.getHostStats(userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Host Stats get successfully",
        data: result
    });
});
exports.StatsControllers = {
    getUserStats,
    getHostStats
};
