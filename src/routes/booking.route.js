import express from "express";
const router = express.Router();

import {
  createBooking,
  verifyPayment,
  getAllBookings,
} from "../controllers/booking.controller.js";

import { handleWebhook } from "../controllers/booking.controller.js";
import { authenticate } from "../middlewares/authentication.middlewares.js";

router
  .route("/")
  .post(authenticate, createBooking)
  .get(authenticate, getAllBookings);

router.route("/webhook").post(handleWebhook);

router.get("/verifyPayment", authenticate, verifyPayment);

export default router;
