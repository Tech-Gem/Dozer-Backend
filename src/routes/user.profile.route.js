const express = require("express");
const {
  createUserProfile,
  uploadProfilePicture,
} = require("../controllers/user.profile.controller");
const router = express.Router();
const { authenticate } = require("../middlewares/authentication");

// POST route for creating user profile
router.route("/").post(authenticate, uploadProfilePicture, createUserProfile);

module.exports = router;
