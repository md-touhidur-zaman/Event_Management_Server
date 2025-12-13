import { Router } from "express";
import { paymentControllers } from "./payment.controllers";

const router = Router()

router.post("/success", paymentControllers.successPayment)

export const paymentRoutes = router