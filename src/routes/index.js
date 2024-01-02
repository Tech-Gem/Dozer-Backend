const express = require("express");
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const userProfileRoutes = require("./user.profile.route");
const otpController = require("./otp.route");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/otp", otpController);
router.use("/profile", userProfileRoutes);

module.exports = router;
