const express = require("express");

const {
  sendSecurityCode,
  verifySecurityCode,
} = require("../controllers/otp.controller");

const router = express.Router();

// POST /sendOtp
router.route("/sendOtp").post(sendSecurityCode);

// POST /verifyCode
router.route("/verifyOtp").post(verifySecurityCode);

module.exports = router;
