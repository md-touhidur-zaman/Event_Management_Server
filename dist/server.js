"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./app/config/env");
const mongoose_1 = __importDefault(require("mongoose"));
const seedAdmin_1 = require("./app/utils/seedAdmin");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let server;
const startServer = async () => {
    try {
        await mongoose_1.default.connect(env_1.envVars.DATABASE_URL);
        console.log("The mongodb is connected");
        server = app_1.app.listen(5000, () => {
            console.log(`The server is running on the port of 5000`);
        });
    }
    catch (error) {
        console.log(error);
    }
};
(async () => {
    await startServer();
    await (0, seedAdmin_1.seedAdmin)();
})();
startServer();
