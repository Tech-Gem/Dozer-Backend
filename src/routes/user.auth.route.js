const express = require("express");

const {
  userRegistration,
  userLogin,
} = require("../controllers/user.auth.controller");
const { authenticate } = require("../middlewares");
const { addUserValidation } = require("../validations/user.validation");

const router = express.Router();

router.route("/register-user").post(addUserValidation, userRegistration);

router.route("/login-user").post(userLogin);

module.exports = router;
