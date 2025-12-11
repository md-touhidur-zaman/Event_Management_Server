import httpStatusCode from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { Host } from "../host/host.model";
import { IEvent } from "./event.interface";
import { Event } from "./event.model";

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

    const createEventInfo = await Event.create([eventPayload], {session});

    await Host.findByIdAndUpdate(hostInfo._id, {
      events: [...hostInfo.events, createEventInfo[0]._id],
    }, {new: true, session});

    await session.commitTransaction();
    session.endSession();

    return createEventInfo;
  } catch (error) {
    await session.commitTransaction();
    session.endSession();
    console.log(error)
    throw error;
  }
};

export const eventServices = {
  createEvent,
};
