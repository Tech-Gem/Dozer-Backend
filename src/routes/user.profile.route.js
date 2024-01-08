const express = require("express");
const {
  createUserProfile,
  getAllUserProfiles,
  getUserProfileById,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/user.profile.controller");
const router = express.Router();
const { authenticate } = require("../middlewares/authentication.middlewares");
const { multerUploads } = require("../middlewares/multer.middlewares");

// POST route for creating user profile

router
  .route("/")
  .post(authenticate, multerUploads, createUserProfile)
  .get(authenticate, getAllUserProfiles);

router
  .route("/:id")
  .get(authenticate, getUserProfileById)
  .put(authenticate, updateUserProfile)
  .delete(authenticate, deleteUserProfile);

module.exports = router;
