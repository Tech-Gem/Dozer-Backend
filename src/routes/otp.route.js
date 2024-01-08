const express = require("express");

const {
  sendSecurityCode,
  verifySecurityCode,
} = require("../controllers/otp.controller");
const { setUserPhoneNumber } = require("../middlewares/otp.middlewares");

const router = express.Router();

// POST /sendOtp
router.route("/sendOtp").post(setUserPhoneNumber, sendSecurityCode);

// POST /verifyCode
router.route("/verifyOtp").post(verifySecurityCode);

module.exports = router;
