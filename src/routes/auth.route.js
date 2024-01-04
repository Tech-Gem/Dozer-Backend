const express = require("express");

const { login, register } = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares");
const { addUserValidation } = require("../validations/user.validation");

const router = express.Router();

// POST /login
router.route("/login").post(login);

// POST /register
router.route("/register").post(authenticate, addUserValidation, register);

module.exports = router;
