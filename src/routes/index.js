const express = require("express");
const userRoutes = require("./user.route");
const userAuthRoutes = require("./user.auth.route");
const renterAuthRoutes = require("./renter.auth.route");
const userProfileRoutes = require("./user.profile.route");
const renterProfileRoutes = require("./renter.profile.route");
const otpController = require("./otp.route");
const equipmentRoutes = require("./equipment.route");
const renterRoutes = require("./renter.route");
const bookingRoutes = require("./booking.route");

const router = express.Router();

router.use("/userAuth", userAuthRoutes);
router.use("/renterAuth", renterAuthRoutes);
router.use("/users", userRoutes);
router.use("/renters", renterRoutes);
router.use("/otp", otpController);
router.use("/userProfile", userProfileRoutes);
router.use("/renterProfile", renterProfileRoutes);
router.use("/equipments", equipmentRoutes);
router.use("/bookings", bookingRoutes);

module.exports = router;
