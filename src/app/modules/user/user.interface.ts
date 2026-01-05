import { Types } from "mongoose";

export interface IAuthProviders{
    providerId: string,
    providerName: string
}

export enum IRole{
    ADMIN = "ADMIN",
    HOST = "HOST",
    USER = "USER"
}
export interface IUser{
    _id?: Types.ObjectId,
    name: string,
    email: string,
    password?:string,
    auths: IAuthProviders[],
    role: IRole
    phone?: string,
    picture?: string,
    about?: string,
    interests:string[],
    location: string,
    isBlocked: boolean,
}

export interface IUpdateUser{
    name?: string,
    email?: string,
    password?:string,
    phone?: string,
    picture?: string,
    about?: string,
    location?: string,
    current_password?: string,
    new_password?: string
}