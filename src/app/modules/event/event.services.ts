import httpStatusCode from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { Host } from "../host/host.model";
import { IEvent } from "./event.interface";
import { Event } from "./event.model";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";

const createEvent = async (user: string, payload: Partial<IEvent>) => {
  const session = await Event.startSession();
  session.startTransaction();
  try {
    const hostInfo = await Host.findOne({ user });

    if (!hostInfo) {
      throw new AppError(httpStatusCode.BAD_REQUEST, "You are not a host");
    }

    const eventPayload: Partial<IEvent> = {
      ...payload,
      host: hostInfo._id,
    };

    const createEventInfo = await Event.create([eventPayload], { session });

    await Host.findByIdAndUpdate(
      hostInfo._id,
      {
        events: [...hostInfo.events, createEventInfo[0]._id],
      },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return createEventInfo;
  } catch (error) {
    await session.commitTransaction();
    session.endSession();
    throw error;
  }
};

const getEventById = async (eventId: string) => {
  const eventInfo = await Event.findById(eventId).populate({
    path: "host",
    select: "user approval_Status",
    populate: {
      path: "user",
      select: "name email phone",
    },
  });

  return eventInfo;
};

const getAllEvent = async () => {
  const getAllEventInfos = await Event.find().populate({
    path: "host",
    select: "user approval_Status",
    populate: {
      path: "user",
      select: "name email phone",
    },
  });

  return getAllEventInfos;
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateEventInfo = async (eventId: string, payload: Partial<IEvent>, file: any) => {
  
  const eventInfo = await Event.findById(eventId) as IEvent

  if(!eventInfo){
    throw new AppError(httpStatusCode.BAD_REQUEST, "The event info not found")
  }

  if(eventInfo.event_status === "COMPLETED"){
    throw new AppError(httpStatusCode.BAD_REQUEST, "You can't update this event. Your event is completed")
  }

  if(file){
    await deleteImageFromCLoudinary(eventInfo?.image)
    payload.image = file.path 
  }

  const updatedEventInfo = await Event.findByIdAndUpdate(eventId, payload, {
    new: true,
  });

  return updatedEventInfo
};

const deleteEventInfo = async (eventId:string) => {
  const eventInfo = await Event.findById(eventId) as IEvent

  if(!eventInfo){
    throw new AppError(httpStatusCode.BAD_REQUEST, "The event info doesn't exist")
  }
  await deleteImageFromCLoudinary(eventInfo.image)
  
  const deletedEventInfo = await Event.findByIdAndDelete(eventId);
  return deletedEventInfo;
};

export const eventServices = {
  createEvent,
  getEventById,
  getAllEvent,
  updateEventInfo,
  deleteEventInfo
  
};
