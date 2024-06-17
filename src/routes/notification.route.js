import express from "express";
const router = express.Router();

import {
  sendBookingRequest,
  sendNotification,
  getNotifications,
  getNotificationsByType,
} from "../controllers/notification.controller.js";
import { authenticate } from "../middlewares/authentication.middlewares.js";

// POST send message
router.route("/send-message").post(sendBookingRequest);
// router.route("/send-notification").post(sendNotification);

// routes for get all notification and by id
router.route("/").get(authenticate,getNotifications);
router.route("/:type").get(getNotificationsByType);

export default router;
