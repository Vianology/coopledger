import { castVote, proposeVote } from "@/controllers/votes.controller";
import { Router } from "express";
import { isAuthenticated } from "@/middlewares/auth.middleware";

const votesRoutes = Router();

votesRoutes.post("/propose", isAuthenticated, proposeVote);
votesRoutes.post("/cast", isAuthenticated, castVote);

export { votesRoutes };
