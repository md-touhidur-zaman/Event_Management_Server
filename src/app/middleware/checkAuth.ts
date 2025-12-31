import  httpStatusCode  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import { verifyToken } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/user/user.model';

export const checkAuth = (...AuthRole: string[]) => async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const accessToken = req.cookies.accessToken;
        
        if(!accessToken){
            throw new AppError(
              httpStatusCode.BAD_REQUEST,
              "You are not login. Please login first"
            );
        }
        const verifiedTokenInfo = await verifyToken(accessToken) as JwtPayload

        if(!verifiedTokenInfo){
            throw new AppError(httpStatusCode.BAD_REQUEST, "You are not login. Please login first")
        }
        

        const isUserExist = await User.findOne({email:verifiedTokenInfo.email})

        if(!isUserExist){
            throw new AppError(httpStatusCode.BAD_REQUEST, "The user does not exist.")
        }

        req.user = verifiedTokenInfo


        // if(isUserExist.isBlocked === true){
        //     throw new AppError(
        //       httpStatusCode.BAD_REQUEST,
        //       "The user is blocked"
        //     );
        // }

        if(!AuthRole.includes(isUserExist.role)){
            throw new AppError(
              httpStatusCode.BAD_REQUEST,
              "You are not permitted for this route."
            );
        }



        next()
        
    } catch (error) {
        next(error)
        
    }

}