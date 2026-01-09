import { Router } from "express";
import { HostControllers } from "./host.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";

const router = Router()

router.get("/published-event", checkAuth(IRole.HOST), HostControllers.getAllPublishedEvents)
router.get("/requested-host", checkAuth(IRole.ADMIN), HostControllers.getRequestedBecomeAHost)
router.post("/become-host", checkAuth(IRole.USER), HostControllers.requestBecomeHost)
router.patch("/update-approval/:id", checkAuth(IRole.ADMIN), HostControllers.updateHostRole)

export const hostRoutes = router