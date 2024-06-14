import express from "express";
import {
  authenticate,
  authorize,
} from "../middlewares/authentication.middlewares.js";
import { verifyRenter, adminLogin } from "../controllers/admin.controller.js";

const router = express.Router();

// This route requires authentication and admin authorization

router.post("/login", adminLogin);

router.patch(
  "/verify-renter/:id",
  authenticate,
  authorize("admin"),
  verifyRenter
);

export default router;
