"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventZodSchema = exports.eventZodSchema = void 0;
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
exports.updateEventZodSchema = zod_1.default.object({
    title: zod_1.default.string().optional(),
    category: zod_1.default.string().optional(),
    organizer_name: zod_1.default.string().optional(),
    date: zod_1.default.string().optional(),
    time: zod_1.default.string().optional(),
    location: zod_1.default.string().optional(),
    total_participants: zod_1.default.number().optional(),
    description: zod_1.default.string().max(400).optional(),
    joining_fee: zod_1.default.number().optional(),
    event_status: zod_1.default.string().optional(),
});
