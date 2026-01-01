"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const event_interface_1 = require("./event.interface");
const eventSchema = new mongoose_1.Schema({
    host: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Host" },
    title: { type: String, required: true },
    category: { type: String, required: true },
    organizer_name: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    total_participants: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    joining_fee: { type: Number, required: true },
    event_status: { type: String, default: event_interface_1.IEventStatus.OPEN },
    total_no_of_booking: { type: Number, default: 0 }
});
exports.Event = (0, mongoose_1.model)("Event", eventSchema);
