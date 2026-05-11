import { Router } from "express";
import { getDashboardData } from "@/controllers/user.controller";
import { isAuthenticated } from "@/middlewares/auth.middleware";

const userRoutes = Router();

userRoutes.get("/dashboard", isAuthenticated, getDashboardData);

export { userRoutes };
