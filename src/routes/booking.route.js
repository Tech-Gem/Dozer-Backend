import express from "express";
const router = express.Router();

import {
  createBooking,
  verifyPayment,
  confirmOrRejectBooking,
  generateLegalDocument,
  agreeToTermsAndConditions,
  generateInvoice,
  initializePayment,
  getAllBookings,
  handleWebhook,
} from "../controllers/booking.controller.js";

import { authenticate } from "../middlewares/authentication.middlewares.js";

router
  .route("/")
  .post(authenticate, createBooking)
  .get(authenticate, getAllBookings);

router.route("/webhook").post(handleWebhook);

router.post("/confirm-or-reject", confirmOrRejectBooking);

// router.get("/verifyPayment", authenticate, verifyPayment);

export default router;
