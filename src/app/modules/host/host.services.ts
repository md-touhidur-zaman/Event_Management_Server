import { IHost } from "./host.interfaces";
import { Host } from "./host.model";

const requestBecomeHost = async(payload: Partial<IHost>) =>{
    

    const hostInfo = await Host.create(payload)
    return hostInfo
}

export const hostServices = {
    requestBecomeHost
}