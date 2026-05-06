import { membershipFee } from "controllers/payments.controller";
import { Router } from "express";
import { isAuthenticated } from "middlewares/auth.middleware";

const paymentsRoutes = Router();

paymentsRoutes.post("/membership-fee", isAuthenticated, membershipFee);
paymentsRoutes.post("/membership-fee/callback", isAuthenticated);

export { paymentsRoutes };
