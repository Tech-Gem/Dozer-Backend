import express from "express";
import { getUsers, getUser } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authentication.middlewares.js";

const router = express.Router();

// get all users
router.route("/").get(authenticate, getUsers);

router.route("/:id").get(authenticate, getUser);

export default router;
