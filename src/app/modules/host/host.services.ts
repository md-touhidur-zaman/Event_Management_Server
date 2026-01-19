import httpStatusCode  from 'http-status-codes';
import AppError from "../../errorHelpers/appError";
import { IRole } from "../user/user.interface";
import { User } from "../user/user.model";
import { IApproval_Status, IHost } from "./host.interfaces";
import { Host } from "./host.model";
import { Event } from '../event/event.model';

const requestBecomeHost = async (payload: Partial<IHost>) => {
  const isHost = await Host.findOne({user: payload.user})

  if(isHost && isHost.approval_Status === IApproval_Status.ACCEPTED){
    throw new AppError(httpStatusCode.BAD_REQUEST, "Your role already a host")
  }
  if(isHost && isHost.approval_Status === IApproval_Status.PENDING){
    throw new AppError(httpStatusCode.BAD_REQUEST, "Your request is pending, Please wait a while")
  }
  if(isHost && isHost.approval_Status === IApproval_Status.REJECTED){
    throw new AppError(httpStatusCode.BAD_REQUEST, "Your request is rejected")
  }

  const hostInfo = await Host.create(payload);
  return hostInfo;
};

const updateHostRole = async (hostId: string, approval_Status: string) => {
  const updatedHostInfo = await (
    await Host.findByIdAndUpdate(hostId, { approval_Status }, { new: true })
  ).populate("user", "name email phone");

  if (updatedHostInfo.approval_Status === IApproval_Status.ACCEPTED) {
    await User.findByIdAndUpdate(updatedHostInfo.user, { role: IRole.HOST });
  }

  return updatedHostInfo;
};

const getAllPublishedEvents = async (userId: string, query: Record<string, string>) => {
  const searchTerm = query.searchTerm === "undefined"?"" : query.searchTerm
  const status = query.status === "undefined"?"": query.status
  const sortBy = query.sortBy === "undefined"?"dsc": query.sortBy

  const itemPerPage = 4
  const page = Number(query.page)

  
  const host = await Host.findOne({ user: userId });

  if (!host){
    throw new AppError(httpStatusCode.BAD_REQUEST, "The host doesn't exist")
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterQuery: Record<string, any> = {
    host: host._id
  }

  if(searchTerm){
    filterQuery.title = { $regex: searchTerm, $options: "i" }
  }

  if(status){
    filterQuery.event_status = status
  }

  const totalEvents = await Event.find(filterQuery).countDocuments()


  const events = await Event.find(filterQuery).sort({ createdAt: sortBy === "asc" ? 1 : -1 }).skip((page-1)*itemPerPage).limit(itemPerPage)

  return {totalEvents,events}
};

const getRequestedBecomeAHost = async() =>{
  const requestedHosts = await Host.find({approval_Status: IApproval_Status.PENDING}).populate("user", "name email phone isBlocked")

  return requestedHosts
}

export const hostServices = {
  requestBecomeHost,
  updateHostRole,
  getAllPublishedEvents,
  getRequestedBecomeAHost
};
