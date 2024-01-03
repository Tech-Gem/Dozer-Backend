const express = require("express");
const {
  getUsers,
  getUser,
} = require("../controllers/user.controller");

const router = express.Router();
const { authenticate } = require("../middlewares/authentication");

// get all users
router.route("/").get(authenticate, getUsers);

router.route("/:id").get(authenticate, getUser);

module.exports = router;
