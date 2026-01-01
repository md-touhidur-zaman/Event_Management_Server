"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserTokens = void 0;
const env_1 = require("../config/env");
const jwt_1 = require("./jwt");
const createUserTokens = async (userInfo) => {
    const jwtPayload = {
        userId: userInfo._id,
        name: userInfo.name,
        email: userInfo.email,
        role: userInfo.role,
    };
    const accessToken = await (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET_KEY, env_1.envVars.JWT_ACCESS_EXPIRES_IN);
    const refreshToken = await (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_REFRESH_SECRET_KEY, env_1.envVars.JWT_REFRESH_EXPIRES_IN);
    return {
        accessToken,
        refreshToken
    };
};
exports.createUserTokens = createUserTokens;
