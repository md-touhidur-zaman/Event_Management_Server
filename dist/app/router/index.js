"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const host_routes_1 = require("../modules/host/host.routes");
const enevt_routes_1 = require("../modules/event/enevt.routes");
const bookings_routes_1 = require("../modules/bookings/bookings.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
const stats_routes_1 = require("../modules/stats/stats.routes");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.userRoutes
    },
    {
        path: "/auth",
        route: auth_routes_1.authRoutes
    },
    {
        path: "/host",
        route: host_routes_1.hostRoutes
    },
    {
        path: "/event",
        route: enevt_routes_1.eventRoutes
    },
    {
        path: "/booking",
        route: bookings_routes_1.bookingRoutes
    },
    {
        path: "/payment",
        route: payment_routes_1.paymentRoutes
    },
    {
        path: "/stats",
        route: stats_routes_1.statsRoutes
    }
];
moduleRoutes.forEach(route => exports.router.use(route.path, route.route));
