import express from "express";
import userRoutes from "./user.route.js";
import userAuthRoutes from "./user.auth.route.js";
import userProfileRoutes from "./user.profile.route.js";
import otpController from "./otp.route.js";
import equipmentRoutes from "./equipment.route.js";
import bookingRoutes from "./booking.route.js";
import forgetPassword from "./forget.password.route.js";
import notificationRoutes from "./notification.route.js";
import biddingRoutes from "./bidding.route.js";
import bidderRoutes from "./bidder.route.js";
import adminRoutes from "./admin.route.js";

const router = express.Router();

router.use("/userAuth", userAuthRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/otp", otpController);
router.use("/resetPassword", forgetPassword);
router.use("/userProfile", userProfileRoutes);
router.use("/equipments", equipmentRoutes);
router.use("/bookings", bookingRoutes);
router.use("/notification", notificationRoutes);
router.use("/biddings", biddingRoutes);
router.use("/bidders", bidderRoutes);

export default router;
