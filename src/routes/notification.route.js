import express from "express";
const router = express.Router();

import {
  sendBookingRequest,
  sendNotification,
} from "../controllers/notification.controller.js";

// POST send message
router.route("/send-message").post(sendBookingRequest);
router.route("/send-notification").post(sendNotification);

export default router;
