"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const auth_services_1 = require("./auth.services");
const setCookies_1 = require("../../utils/setCookies");
const credentialsLogin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const loginInfo = await auth_services_1.authServices.credentialsLogin(req.body);
    await (0, setCookies_1.setCookies)(res, loginInfo.userTokens);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "The user login successfully...",
        data: loginInfo,
    });
});
const logOut = (0, catchAsync_1.catchAsync)(async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Logged Out Successfully",
        data: null,
    });
});
exports.authControllers = {
    credentialsLogin,
    logOut
};
