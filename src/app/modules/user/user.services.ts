import AppError from "../../errorHelpers/appError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatusCode from "http-status-codes" 
import bcryptjs from "bcryptjs"
import { envVars } from "../../config/env";

const createUser = async(payload: Partial<IUser>) =>{
    const {email, password} = payload
    const isUserExist = await User.findOne({email})
    if(isUserExist){
        throw new AppError(httpStatusCode.BAD_GATEWAY, "You Already registered.")
    }
    if(password){
        const hashedPassword = await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_COUNT))
        payload.password = hashedPassword
    }
    const userPayload: Partial<IUser> = {
        ...payload,
        auths: [
            {
                providerId: payload.email as string,
                providerName: "Credentials"
            }
        ]
    }
    const createUserInfo = await User.create(userPayload)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: pass, ...rest} = createUserInfo.toObject()

    return rest
    
}

const getAllUser = async() =>{
    const allUsersInfo = await User.find()
    return allUsersInfo
}


const getUserById = async(id: string) =>{
    const userInfo = await User.findById(id)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: pass, ...rest} = userInfo.toObject()
    
    return rest
}

const updateUser = async (id: string, updatedDoc: Partial<IUser>) => {

  if (updatedDoc.password) {
    const hashedPassword = await bcryptjs.hash(updatedDoc.password, envVars.BCRYPT_SALT_COUNT)
    updatedDoc.password = hashedPassword
  }

  const updatedUserInfo = await User.findByIdAndUpdate(id, updatedDoc, {
    new: true
  })

  return updatedUserInfo


}


export const userServices = {
    createUser,
    getAllUser,
    getUserById,
    updateUser
}