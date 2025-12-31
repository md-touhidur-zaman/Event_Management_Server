import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const createUserTokens = async (userInfo: Partial<IUser>) => {
  const jwtPayload = {
    userId: userInfo._id,
    name: userInfo.name,
    email: userInfo.email,
    role: userInfo.role,
  };

  const accessToken = await generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET_KEY,
    envVars.JWT_ACCESS_EXPIRES_IN
  );

  const refreshToken = await generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET_KEY,
    envVars.JWT_REFRESH_EXPIRES_IN
  );

  return {
    accessToken,
    refreshToken
  }
};
