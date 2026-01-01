"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../errorHelpers/appError"));
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../modules/user/user.model");
const checkAuth = (...AuthRole) => async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not login. Please login first");
        }
        const verifiedTokenInfo = await (0, jwt_1.verifyToken)(accessToken);
        if (!verifiedTokenInfo) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not login. Please login first");
        }
        const isUserExist = await user_model_1.User.findOne({ email: verifiedTokenInfo.email });
        if (!isUserExist) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "The user does not exist.");
        }
        req.user = verifiedTokenInfo;
        // if(isUserExist.isBlocked === true){
        //     throw new AppError(
        //       httpStatusCode.BAD_REQUEST,
        //       "The user is blocked"
        //     );
        // }
        if (!AuthRole.includes(isUserExist.role)) {
            throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not permitted for this route.");
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkAuth = checkAuth;
