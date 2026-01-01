"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const user_services_1 = require("./user.services");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    // payload.interests = await payload?.interests.split(",");
    const result = await user_services_1.userServices.createUser(payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User Created Successfully",
        data: result,
    });
});
const getAllUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_services_1.userServices.getAllUser();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All user's info retrieve successfully",
        data: result,
    });
});
const getUserById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const result = await user_services_1.userServices.getUserById(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User info retrieve successfully",
        data: result,
    });
});
const updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const userId = decodedToken.userId;
    const updatedDoc = req.body;
    //   const { password, ...rest } = updatedDoc;
    //   if (password === "") {
    //     updatedDoc = rest;
    //   }
    const result = await user_services_1.userServices.updateUser(userId, updatedDoc);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "You successfully updated your profile",
        data: result,
    });
});
exports.userControllers = {
    createUser,
    getAllUser,
    getUserById,
    updateUser,
};
