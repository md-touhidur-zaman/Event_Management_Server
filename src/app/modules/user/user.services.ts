import AppError from "../../errorHelpers/appError";
import { IUpdateUser, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatusCode from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatusCode.BAD_GATEWAY, "You Already registered.");
  }
  if (password) {
    const hashedPassword = await bcryptjs.hash(
      password,
      Number(envVars.BCRYPT_SALT_COUNT)
    );
    payload.password = hashedPassword;
  }
  const userPayload: Partial<IUser> = {
    ...payload,
    auths: [
      {
        providerId: payload.email as string,
        providerName: "Credentials",
      },
    ],
  };
  const createUserInfo = await User.create(userPayload);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = createUserInfo.toObject();

  return rest;
};

const getAllUser = async () => {
  const allUsersInfo = await User.find();
  return allUsersInfo;
};

const getUserById = async (id: string) => {
  const userInfo = await User.findById(id);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = userInfo.toObject();

  return rest;
};

const updateUser = async (
  id: string,
  updatedDoc: Partial<IUpdateUser>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any
) => {
  const userInfo = await User.findById(id);
  if (!userInfo) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "No User Data Found");
  }

  if (updatedDoc?.new_password) {
    const isMatchedPassword = await bcryptjs.compare(
      updatedDoc.current_password,
      userInfo.password
    );

    if (!isMatchedPassword) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        "Your Current Password Doesn't Match"
      );
    }

    const hashedPassword = await bcryptjs.hash(
      updatedDoc.new_password,
      envVars.BCRYPT_SALT_COUNT
    );
    updatedDoc.password = hashedPassword;
  }

  if (file) {
    await deleteImageFromCLoudinary(userInfo?.picture);
    updatedDoc.picture = file.path;
  }

  const updatedUserInfo = await User.findByIdAndUpdate(id, updatedDoc, {
    new: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = updatedUserInfo.toObject();

  return rest;
};

export const userServices = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
};
