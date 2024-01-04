const express = require("express");
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const userProfileRoutes = require("./user.profile.route");
const otpController = require("./otp.route");
const equipmentRoutes = require("./equipment.route");
const bookingRoutes = require("./booking.route")
const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/otp", otpController);
router.use("/profile", userProfileRoutes);
router.use("/equipments", equipmentRoutes);
router.use("/bookings",bookingRoutes);
module.exports = router;
