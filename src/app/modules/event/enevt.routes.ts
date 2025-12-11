import { Router } from "express";
import { eventControllers } from "./event.controllers";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";
import { MulterUpload } from "../../config/multer.config";
import { validationRequest } from "../../middleware/validationRequest";
import { eventZodSchema } from "./event.validation";

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
  "/update",
  checkAuth(IRole.HOST),
  eventControllers.updateEventInfo
);
router.patch(
  "/delete",
  checkAuth(IRole.HOST),
  eventControllers.deleteEventInfo
);

export const eventRoutes = router;
