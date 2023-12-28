const express = require("express");

const { login, register } = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares");

const router = express.Router();

// POST /login
router.route("/login").post(login);

// POST /register
router.route("/register").post(authenticate, register);

module.exports = router;
