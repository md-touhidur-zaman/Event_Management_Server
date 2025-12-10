import { Router } from "express";
import { HostControllers } from "./host.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";

const router = Router()

router.post("/become-host", checkAuth(IRole.USER), HostControllers.requestBecomeHost)

export const hostRoutes = router