// biddingRoutes.js
import express from "express";
import { createBidSpace } from "../controllers/bid.space.controller.js";
import { authenticate } from "../middlewares/authentication.middlewares.js";

const router = express.Router();

router.route("/").post(authenticate, createBidSpace);

export default router;
