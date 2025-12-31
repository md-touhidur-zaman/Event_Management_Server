import { model, Schema } from "mongoose";
import { IEvent, IEventStatus } from "./event.interface";

const eventSchema = new Schema<IEvent>({
    host: {type: Schema.Types.ObjectId, required: true, ref:"Host"},
    title: {type: String, required: true },
    category: {type: String, required: true},
    organizer_name:{type: String, required: true },
    date: {type: String, required: true},
    time: {type: String, required: true},
    location: {type: String, required: true},
    total_participants: {type: Number, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    joining_fee: {type: Number, required: true},
    event_status: {type: String, default: IEventStatus.OPEN},
    total_no_of_booking:{type: Number, default: 0}
})


export const Event = model<IEvent>("Event", eventSchema)