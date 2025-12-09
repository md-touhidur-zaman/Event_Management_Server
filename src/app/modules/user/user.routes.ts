import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router()


router.post("/create-user", userControllers.createUser)



export const userRoutes = router