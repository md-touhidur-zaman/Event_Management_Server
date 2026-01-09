import { Router } from "express";
import { bookingsControllers } from "./bookings.controllers";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";

const router = Router()

router.get("/participants/:eventId", checkAuth(IRole.HOST), bookingsControllers.getBookingsByEventId)
router.get("/my-bookings", checkAuth(IRole.USER), bookingsControllers.getMyBookings)
router.post("/create-booking", checkAuth(IRole.USER), bookingsControllers.createBookings)


export const bookingRoutes = router