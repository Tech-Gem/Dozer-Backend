const express = require("express");
const router = express.Router();

const {
  bookEquipment,
  getAllBookings,
} = require("../controllers/booking.controller");
const { authenticate } = require("../middlewares/authentication.middlewares");

router
  .route("/")
  .post(authenticate, bookEquipment)
  .get(authenticate, getAllBookings);

module.exports = router;
