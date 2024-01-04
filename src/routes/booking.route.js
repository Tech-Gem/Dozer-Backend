const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingById,
  deleteBooking,
} = require("../controllers/booking.controller");
const { authenticate } = require("../middlewares/authentication");

router
  .route("/")
  .post(authenticate, createBooking);

router
  .route("/:id")
  .get(authenticate, getBookingById)
  .delete(authenticate, deleteBooking);

module.exports = router;
