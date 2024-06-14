import express from "express";
import { getRecommendationsForUser } from "../controllers/recommendation.controller.js";
import { authenticate } from "../middlewares/authentication.middlewares.js";

const router = express.Router();

router.get("/:userId", authenticate, getRecommendationsForUser);

export default router;
