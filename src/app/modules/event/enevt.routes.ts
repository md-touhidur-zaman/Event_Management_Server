import { Router } from "express";
import { eventControllers } from "./event.controllers";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";
import { MulterUpload } from "../../config/multer.config";
import { validationRequest } from "../../middleware/validationRequest";
import { eventZodSchema, updateEventZodSchema } from "./event.validation";

const router = Router();

router.get("/", eventControllers.getAllEvent);

router.get(
  "/:id",
  checkAuth(IRole.USER, IRole.HOST, IRole.ADMIN),
  eventControllers.getEventById
);


router.post(
  "/create-event",
  checkAuth(IRole.HOST),
  MulterUpload.single("file"),
  validationRequest(eventZodSchema),
  eventControllers.createEvent
);

router.patch(
  "/update/:id",
  checkAuth(IRole.HOST),
  MulterUpload.single("file"),
  validationRequest(updateEventZodSchema),
  eventControllers.updateEventInfo
);

router.delete(
  "/delete/:id",
  checkAuth(IRole.HOST, IRole.ADMIN),
  eventControllers.deleteEventInfo
);

export const eventRoutes = router;
