"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const appError_1 = __importDefault(require("../errorHelpers/appError"));
const cloudinary_config_1 = require("../config/cloudinary.config");
const globalErrorHandler = async (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    let status_code = 500;
    let message = "Something went wrong....";
    if (req.file) {
        await (0, cloudinary_config_1.deleteImageFromCLoudinary)(req.file.path);
    }
    if (err instanceof appError_1.default) {
        status_code = err.status_code;
        message = err.message;
    }
    else if (err instanceof Error) {
        status_code = 500;
        message = err.message;
    }
    res.status(status_code).json({
        success: false,
        status_code,
        message,
        err,
    });
};
exports.globalErrorHandler = globalErrorHandler;
