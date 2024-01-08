const express = require("express");

const {
  renterRegistration,
  renterLogin,
} = require("../controllers/renter.auth.controller");
const { authenticate } = require("../middlewares");
const { addUserValidation } = require("../validations/user.validation");

const router = express.Router();

router.route("/register-renter").post(addUserValidation, renterRegistration);

router.route("/login-renter").post(renterLogin);

module.exports = router;
