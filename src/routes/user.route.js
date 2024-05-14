import express from "express";
import {
  getUsers,
  getUser,
  getRenters,
  deleteUser,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authentication.middlewares.js";

const router = express.Router();

router.route("/").get(authenticate, getUsers);

router.get("/renters", authenticate, getRenters);

router
  .route("/:id")
  .get(authenticate, getUser)
  .delete(authenticate, deleteUser);

export default router;
