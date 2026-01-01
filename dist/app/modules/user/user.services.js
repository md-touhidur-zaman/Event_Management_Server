"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const createUser = async (payload) => {
    const { email, password } = payload;
    const isUserExist = await user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_GATEWAY, "You Already registered.");
    }
    if (password) {
        const hashedPassword = await bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_COUNT));
        payload.password = hashedPassword;
    }
    const userPayload = {
        ...payload,
        auths: [
            {
                providerId: payload.email,
                providerName: "Credentials"
            }
        ]
    };
    const createUserInfo = await user_model_1.User.create(userPayload);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = createUserInfo.toObject();
    return rest;
};
const getAllUser = async () => {
    const allUsersInfo = await user_model_1.User.find();
    return allUsersInfo;
};
const getUserById = async (id) => {
    const userInfo = await user_model_1.User.findById(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = userInfo.toObject();
    return rest;
};
const updateUser = async (id, updatedDoc) => {
    if (updatedDoc?.password) {
        const hashedPassword = await bcryptjs_1.default.hash(updatedDoc.password, env_1.envVars.BCRYPT_SALT_COUNT);
        updatedDoc.password = hashedPassword;
    }
    const updatedUserInfo = await user_model_1.User.findByIdAndUpdate(id, updatedDoc, {
        new: true
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = updatedUserInfo.toObject();
    return rest;
};
exports.userServices = {
    createUser,
    getAllUser,
    getUserById,
    updateUser
};
