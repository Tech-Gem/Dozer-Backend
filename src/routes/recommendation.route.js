import express from "express";
import { getRecommendationsForUser } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.get("/:userId", getRecommendationsForUser);

export default router;
