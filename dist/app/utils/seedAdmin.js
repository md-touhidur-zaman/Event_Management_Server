"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = void 0;
/* eslint-disable no-console */
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const seedAdmin = async () => {
    try {
        const isAdminExist = await user_model_1.User.findOne({ email: env_1.envVars.ADMIN_Email });
        if (isAdminExist) {
            console.log("The admin already created");
            return;
        }
        console.log("Admin creating start...");
        const hashedPassword = await bcryptjs_1.default.hash(env_1.envVars.ADMIN_PASS, Number(env_1.envVars.BCRYPT_SALT_COUNT));
        const adminPayload = {
            name: env_1.envVars.ADMIN_NAME,
            email: env_1.envVars.ADMIN_Email,
            password: hashedPassword,
            phone: env_1.envVars.ADMIN_PHONE,
            role: user_interface_1.IRole.ADMIN,
            location: env_1.envVars.ADMIN_LOCATION
        };
        await user_model_1.User.create(adminPayload);
        console.log("Admin created successful.\n");
    }
    catch (error) {
        console.log(error);
    }
};
exports.seedAdmin = seedAdmin;
