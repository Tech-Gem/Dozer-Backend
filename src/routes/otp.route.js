const express = require("express");

const {
  sendSecurityCode,
  verifySecurityCode,
} = require("../controllers/otp.controller");

const router = express.Router();

// POST /sendOtp
router.route("/sendOtp").get(sendSecurityCode);

// POST /verifyCode
router.route("/verifyOtp").get(verifySecurityCode);

module.exports = router;
