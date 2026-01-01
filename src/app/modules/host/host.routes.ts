import { Router } from "express";
import { HostControllers } from "./host.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";

const router = Router()

router.get("/published-event", checkAuth(IRole.HOST), HostControllers.getAllPublishedEvents)
router.post("/become-host", checkAuth(IRole.USER), HostControllers.requestBecomeHost)
router.post("/update-approval/:id", checkAuth(IRole.ADMIN), HostControllers.updateHostRole)

export const hostRoutes = router