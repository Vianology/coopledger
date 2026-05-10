import {
  initiatePayment,
  paymentCallback,
} from "controllers/payments.controller";
import { Router } from "express";
import { isAuthenticated } from "middlewares/auth.middleware";

const paymentsRoutes = Router();

paymentsRoutes.post("/initiate", isAuthenticated, initiatePayment);
paymentsRoutes.post("/callback", paymentCallback);

export { paymentsRoutes };
