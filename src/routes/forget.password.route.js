import express from "express";
import { resetPassword } from "../controllers/forget.password.controller.js";
import { authenticate } from "../middlewares/authentication.middlewares.js";

const router = express.Router();

router.route("/").post(authenticate, resetPassword);

export default router;
