import { Router } from "express";
import { eventControllers } from "./event.controllers";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";
import { MulterUpload } from "../../config/multer.config";
import { validationRequest } from "../../middleware/validationRequest";
import { eventZodSchema } from "./event.validation";

const router = Router();

router.post(
  "/create-event",
  checkAuth(IRole.HOST),
  MulterUpload.single("file"),
  validationRequest(eventZodSchema),
  eventControllers.createEvent
);

export const eventRoutes = router;
