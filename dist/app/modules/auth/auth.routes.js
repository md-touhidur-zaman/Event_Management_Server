"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controllers_1 = require("./auth.controllers");
const router = (0, express_1.Router)();
router.post("/login", auth_controllers_1.authControllers.credentialsLogin);
router.post("/logout", auth_controllers_1.authControllers.logOut);
exports.authRoutes = router;
