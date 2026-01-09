import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { hostRoutes } from "../modules/host/host.routes";
import { eventRoutes } from "../modules/event/enevt.routes";
import { bookingRoutes } from "../modules/bookings/bookings.routes";
import { paymentRoutes } from "../modules/payment/payment.routes";
import { statsRoutes } from "../modules/stats/stats.routes";


export const router = Router()

const moduleRoutes = [
    {
        path:"/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/host",
        route: hostRoutes
    },
    {
        path: "/event",
        route: eventRoutes
    },
    {
        path: "/booking",
        route: bookingRoutes
    },
    {
        path: "/payment",
        route: paymentRoutes
    },
    {
        path: "/stats",
        route: statsRoutes
    }
]

moduleRoutes.forEach(route=> router.use(route.path, route.route))