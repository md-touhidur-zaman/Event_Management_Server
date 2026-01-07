"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserZodSchemaUser = exports.createZodSchemaUser = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createZodSchemaUser = zod_1.default.object({
    name: zod_1.default
        .string({ message: "Name must be string" })
        .min(3, { message: "The name must be 3 character" })
        .max(30, { message: "The name length must be less than 30" }),
    email: zod_1.default.string().email({ error: "Please provide a valid email" }),
    password: zod_1.default
        .string()
        .regex(/^(?=.*[A-Z])/, {
        message: "The password must have one upper case letter",
    })
        .regex(/^(?=.*\d)/, { message: "The password must have one number" })
        .regex(/^(?=.*[!@#$%^&*,.?":{}|<>_\-+=~`[\]\\;/'])/, {
        message: "The password must have a special character",
    }),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+?88)?01[3-9]\d{8}$/, {
        message: "Phone number must be Bangladeshi format..., for example:- +8801700000000",
    })
        .optional(),
    about: zod_1.default
        .string()
        .max(150, {
        message: "The about section will be less than or equal 150 words",
    })
        .optional(),
    interests: zod_1.default.array(zod_1.default.string()),
    location: zod_1.default.string(),
    role: zod_1.default.string({ message: "role is required" }).optional(),
    picture: zod_1.default.string().optional(),
    isBlocked: zod_1.default.boolean().optional(),
});
exports.UpdateUserZodSchemaUser = zod_1.default.object({
    name: zod_1.default
        .string({ message: "Name must be string" })
        .min(3, { message: "The name must be 3 character" })
        .max(30, { message: "The name length must be less than 30" }).optional(),
    email: zod_1.default.string().email({ error: "Please provide a valid email" }).optional(),
    phone: zod_1.default
        .string()
        .optional(),
    about: zod_1.default
        .string()
        .max(150, {
        message: "The about section will be less than or equal 150 words",
    })
        .optional(),
    location: zod_1.default.string().optional(),
    picture: zod_1.default.string().optional(),
    new_password: zod_1.default.string().optional(),
    current_password: zod_1.default.string().optional()
});
