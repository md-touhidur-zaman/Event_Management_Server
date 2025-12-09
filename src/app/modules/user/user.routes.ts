import { Router } from "express";
import { userControllers } from "./user.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { createZodSchemaUser } from "./user.validates";

const router = Router()


router.post("/create-user", validationRequest(createZodSchemaUser), userControllers.createUser)



export const userRoutes = router