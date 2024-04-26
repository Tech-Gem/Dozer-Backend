import express from "express";
import {
  sendSecurityCode,
  verifySecurityCode,
} from "../controllers/otp.controller.js";
import { setUserPhoneNumber } from "../middlewares/otp.middlewares.js";

const router = express.Router();

// POST /sendOtp
router.route("/sendOtp").post(setUserPhoneNumber, sendSecurityCode);

// POST /verifyCode
router.route("/verifyOtp").post(verifySecurityCode);

export default router;
