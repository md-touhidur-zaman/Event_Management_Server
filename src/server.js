"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server;
var express_1 = require("express");
var app = (0, express_1.default)();
var startServer = function () {
    try {
        // mongoose.connect(envVars.DATABASE_URL)
        console.log("The mongodb is connected");
        server = app.listen(5000, function () {
            console.log("The server is running on the port of 5000");
        });
    }
    catch (error) {
        console.log(error);
    }
};
// (async()=>{
//     await startServer();
//     await seedAdmin();
// })()
startServer();
