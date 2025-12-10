import  bcryptjs  from 'bcryptjs';
import  httpStatusCode  from 'http-status-codes';
import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const credentialsLogin = async(payload: Partial<IUser>) =>{
    const {email, password} = payload 

    const isUserExist = await User.findOne({email})

    if(!isUserExist){
        throw new AppError(httpStatusCode.BAD_REQUEST, "Your email address is not valid")
    }

    const isMatchedPassword = await bcryptjs.compare(password as string, isUserExist.password as string)

    if(!isMatchedPassword){
        throw new AppError(httpStatusCode.NOT_FOUND, "The password does not matched")
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: pass, ...rest} = isUserExist.toObject()

    return rest


}


export const authServices = {
    credentialsLogin
}