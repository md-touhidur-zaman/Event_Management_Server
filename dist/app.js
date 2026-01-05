"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router_1 = require("./app/router");
const globalErrorHandler_1 = require("./app/middleware/globalErrorHandler");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://event-management-nine-brown.vercel.app"],
    credentials: true
}));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use("/api/v1", router_1.router);
exports.app.get("/", (req, res) => {
    res.status(200).send({
        success: true,
        statusCode: true,
        message: "The event management api is coming soon...."
    });
});
exports.app.use(globalErrorHandler_1.globalErrorHandler);
