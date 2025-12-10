import { Router } from "express";
import { userControllers } from "./user.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { createZodSchemaUser } from "./user.validates";

const router = Router()

router.get("/get-all-users", userControllers.getAllUser)
router.get("/:id", userControllers.getUserById)
router.post("/create-user", validationRequest(createZodSchemaUser), userControllers.createUser)
router.post("/update-user", userControllers.updateUser)


export const userRoutes = router