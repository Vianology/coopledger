import {
  approveCooperativeJoin,
  createCooperative,
  joinCooperative,
} from "controllers/cooperatives.controller";
import { Router } from "express";
import { isAuthenticated, isPlatformAdmin } from "middlewares/auth.middleware";
import { upload } from "server";

const cooperativesRoutes = Router();

cooperativesRoutes.post(
  "/create",
  upload.fields([
    { name: "status_document", maxCount: 1 },
    { name: "proof_document", maxCount: 1 },
    { name: "identity_document", maxCount: 1 },
    { name: "business_plan_document", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  isAuthenticated,
  createCooperative,
);
cooperativesRoutes.post("/join", isAuthenticated, joinCooperative);
cooperativesRoutes.post(
  "/join/approve",
  isAuthenticated,
  isPlatformAdmin,
  approveCooperativeJoin,
);

export { cooperativesRoutes };
