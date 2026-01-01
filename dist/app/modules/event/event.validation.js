"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.eventZodSchema = zod_1.default.object({
    title: zod_1.default.string(),
    category: zod_1.default.string(),
    organizer_name: zod_1.default.string(),
    date: zod_1.default.string(),
    time: zod_1.default.string(),
    location: zod_1.default.string(),
    total_participants: zod_1.default.number(),
    description: zod_1.default.string().max(400),
    joining_fee: zod_1.default.number(),
    event_status: zod_1.default.string().optional(),
});
