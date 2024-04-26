import express from "express";
import {
  userRegistration,
  userLogin,
} from "../controllers/user.auth.controller.js";
import { authenticate } from "../middlewares/index.js";
import { addUserValidation } from "../validations/user.validation.js";

const router = express.Router();

router.route("/register-user").post(addUserValidation, userRegistration);

router.route("/login-user").post(userLogin);

export default router;
