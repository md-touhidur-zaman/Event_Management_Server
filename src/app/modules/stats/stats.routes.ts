import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";
import { StatsControllers } from "./stats.controller";

const router = Router()

router.get("/user-stats", checkAuth(IRole.USER), StatsControllers.getUserStats)
router.get("/host-stats", checkAuth(IRole.HOST), StatsControllers.getHostStats)
router.get("/admin-stats", checkAuth(IRole.ADMIN), StatsControllers.getAdminStats)


export const statsRoutes = router