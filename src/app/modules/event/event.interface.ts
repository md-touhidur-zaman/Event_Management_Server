import { Types } from "mongoose";

export enum IEventStatus{
    OPEN = "OPEN",
    FULL = "FULL",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}

export interface IEvent{
    host:Types.ObjectId,
    title: string,
    category: string,
    organizer_name: string,
    date: string,
    time: string,
    location: string,
    total_participants: number,
    description: string,
    image: string,
    joining_fee: number,
    event_status: IEventStatus,
    total_no_of_booking: number
}