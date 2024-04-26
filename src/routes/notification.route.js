import express from "express";
const router = express.Router();

import { sendBookingRequest } from "../controllers/notification.controller.js";

// POST send message
router.route("/send-message").post(sendBookingRequest);

export default router;
