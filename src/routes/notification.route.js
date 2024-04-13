const express = require("express");
const router = express.Router();

const {
  sendBookingRequest,
} = require("../controllers/notification.controller");

// POST send message
router.route("/send-message").post(sendBookingRequest);

module.exports = router;
