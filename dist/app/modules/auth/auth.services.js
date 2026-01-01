"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const user_model_1 = require("../user/user.model");
const userToken_1 = require("../../utils/userToken");
const credentialsLogin = async (payload) => {
    const { email, password } = payload;
    const isUserExist = await user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your email address is not valid");
    }
    const isMatchedPassword = await bcryptjs_1.default.compare(password, isUserExist.password);
    if (!isMatchedPassword) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "The password does not matched");
    }
    const userTokens = await (0, userToken_1.createUserTokens)(isUserExist);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();
    return {
        userTokens,
        user: rest,
    };
};
exports.authServices = {
    credentialsLogin,
};
