import { Router } from "express";
import { userControllers } from "./user.controller";
import { validationRequest } from "../../middleware/validationRequest";
import { createZodSchemaUser, UpdateUserZodSchemaUser } from "./user.validates";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "./user.interface";
import { MulterUpload } from "../../config/multer.config";

const router = Router();

router.get(
  "/user-info",
  checkAuth(IRole.ADMIN, IRole.HOST, IRole.USER),
  userControllers.getUserById
);
router.get(
  "/get-all-users",
  checkAuth(IRole.ADMIN),
  userControllers.getAllUser
);
router.post(
  "/create-user",
  validationRequest(createZodSchemaUser),
  userControllers.createUser
);
router.patch(
  "/update-user",
  checkAuth(IRole.ADMIN, IRole.HOST, IRole.USER),
  MulterUpload.single("file"),
  validationRequest(UpdateUserZodSchemaUser),
  userControllers.updateUser
);

export const userRoutes = router;
