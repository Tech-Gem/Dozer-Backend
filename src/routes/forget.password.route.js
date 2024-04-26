import express from "express";
import { resetPassword } from "../controllers/forget.password.controller.js";

const router = express.Router();

// POST /resetPassword
router.route("/").post(resetPassword);

export default router;
