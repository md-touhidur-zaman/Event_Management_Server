import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { hostRoutes } from "../modules/host/host.routes";
import { eventRoutes } from "../modules/event/enevt.routes";
import { bookingRoutes } from "../modules/bookings/bookings.routes";


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
    }
]

moduleRoutes.forEach(route=> router.use(route.path, route.route))