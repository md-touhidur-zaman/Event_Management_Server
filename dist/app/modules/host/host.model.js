"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Host = void 0;
const mongoose_1 = require("mongoose");
const host_interfaces_1 = require("./host.interfaces");
const hostSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    approval_Status: {
        type: String,
        enum: Object.values(host_interfaces_1.IApproval_Status),
        default: host_interfaces_1.IApproval_Status.PENDING,
    },
    events: { type: [mongoose_1.Schema.Types.ObjectId], ref: "Event" },
}, { timestamps: true, versionKey: false });
exports.Host = (0, mongoose_1.model)("Host", hostSchema);
