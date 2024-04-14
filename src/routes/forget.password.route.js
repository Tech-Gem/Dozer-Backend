const express = require("express");

const { resetPassword } = require("../controllers/forget.password.controller");

const router = express.Router();

// POST /resetPassword
router.route("/").post(resetPassword);

module.exports = router;
