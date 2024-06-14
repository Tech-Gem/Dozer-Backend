import express from "express";
import {
  getUsers,
  getUser,
  getRenters,
  deleteUser,
} from "../controllers/user.controller.js";
import {
  authenticate,
  authorize,
} from "../middlewares/authentication.middlewares.js";

const router = express.Router();

router.route("/").get(authenticate, authorize("admin"), getUsers);

router.get("/renters", authenticate, authorize("admin"), getRenters);

router
  .route("/:id")
  .get(authenticate, authorize("admin"), getUser)
  .delete(authenticate, authorize("admin"), deleteUser);

export default router;
