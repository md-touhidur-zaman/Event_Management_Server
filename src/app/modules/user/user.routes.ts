import { Router } from "express";
import { userControllers } from "./user.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { createZodSchemaUser } from "./user.validates";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "./user.interface";

const router = Router()

router.get("/get-all-users",checkAuth(IRole.ADMIN), userControllers.getAllUser)
router.get("/:id", checkAuth(IRole.ADMIN, IRole.HOST, IRole.USER), userControllers.getUserById)
router.post("/create-user", validationRequest(createZodSchemaUser), userControllers.createUser)
router.patch("/update-user",checkAuth(IRole.ADMIN, IRole.HOST, IRole.USER), userControllers.updateUser)


export const userRoutes = router