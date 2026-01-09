import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";
import { StatsControllers } from "./stats.controller";

const router = Router()

router.get("/user-stats", checkAuth(IRole.USER), StatsControllers.getUserStats)


export const statsRoutes = router