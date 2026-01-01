import { IRole } from "../user/user.interface";
import { User } from "../user/user.model";
import { IApproval_Status, IHost } from "./host.interfaces";
import { Host } from "./host.model";

const requestBecomeHost = async(payload: Partial<IHost>) =>{
    const hostInfo = await Host.create(payload)
    return hostInfo
}

const updateHostRole = async(hostId: string, approval_Status: string) =>{

    const updatedHostInfo = await (await Host.findByIdAndUpdate(hostId, {approval_Status}, {new: true})).populate("user", "name email phone")

    if(updatedHostInfo.approval_Status === IApproval_Status.ACCEPTED){
        await User.findByIdAndUpdate(updatedHostInfo.user, {role: IRole.HOST})
    }

    return updatedHostInfo
}

const getAllPublishedEvents = async(userId:string) =>{
    const allPublishedEvents = await Host.findOne({user: userId}).populate("events")
    return allPublishedEvents
}



export const hostServices = {
    requestBecomeHost,
    updateHostRole,
    getAllPublishedEvents
}