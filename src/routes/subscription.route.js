import express from "express";
const router = express.Router();

import {
  createSubscription,
  verifySubscription,
  getAllSubscriptions,
} from "../controllers/subscription.controller.js";

import { authenticate } from "../middlewares/authentication.middlewares.js";

router
  .route("/")
  .post(authenticate, createSubscription)
  .get(authenticate, getAllSubscriptions);

router.route("/verifyPayment").post(verifySubscription);

// router.get("/verifyPayment", authenticate, verifyPayment);

export default router;
