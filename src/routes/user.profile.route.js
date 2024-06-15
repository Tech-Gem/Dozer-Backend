import express from "express";
import {
  createUserProfile,
  getAllUserProfiles,
  getUserProfileById,
  updateUserProfile,
  deleteUserProfile,
} from "../controllers/user.profile.controller.js";
import {
  authenticate,
  authorize,
} from "../middlewares/authentication.middlewares.js";
// import { multerUploads } from "../middlewares/multer.middlewares.js";

const router = express.Router();

// POST route for creating user profile
router
  .route("/")
  .post(authenticate, createUserProfile)
  .get(authenticate, authorize("admin"), getAllUserProfiles);

router
  .route("/:id")
  .get(getUserProfileById)
  .put(authenticate, updateUserProfile)
  .delete(authenticate, deleteUserProfile);

export default router;
