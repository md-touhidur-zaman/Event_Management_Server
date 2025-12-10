import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { hostRoutes } from "../modules/host/host.routes";


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
    }
]

moduleRoutes.forEach(route=> router.use(route.path, route.route))