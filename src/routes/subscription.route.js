import express from "express";
const router = express.Router();

import {
  createSubscription,
  verifySubscription,
  getAllSubscriptions,
} from "../controllers/subscription.controller.js";

import {
  authenticate,
  authorize,
} from "../middlewares/authentication.middlewares.js";

router
  .route("/")
  .post(authenticate, createSubscription)
  .get(authenticate, authorize("admin"), getAllSubscriptions);

router.route("/verifyPayment").post(verifySubscription);

// router.get("/verifyPayment", authenticate, verifyPayment);

export default router;
