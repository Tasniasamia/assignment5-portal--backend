import { Router } from "express";
import express from "express";
import { paymentController } from "./payment.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


// ✅ Member routes
router.post(
  "/initiate",
  checkAuth(Role.MEMBER, Role.ADMIN),
  paymentController.initiatePayment
);

router.get(
  "/verify/:ideaId",
  checkAuth(Role.MEMBER, Role.ADMIN),
  paymentController.verifyPayment
);

router.get(
  "/my",
  checkAuth(Role.MEMBER, Role.ADMIN),
  paymentController.getMyPayments
);

export const paymentRoutes = router;