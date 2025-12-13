import { Router } from "express";
import { paymentControllers } from "./payment.controllers";

const router = Router()

router.post("/init-payment/:id", paymentControllers.initPayment)
router.post("/success", paymentControllers.successPayment)
router.post("/cancel", paymentControllers.cancelPayment)
router.post("/failed", paymentControllers.failedPayment)


export const paymentRoutes = router