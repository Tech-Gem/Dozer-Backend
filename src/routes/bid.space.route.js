import express from "express";
import {
  createBidSpace,
  getBidSpaces,
  getBidSpaceById,
  updateBidSpace,
  deleteBidSpace,
} from "../controllers/bid.space.controller.js";
import {
  authenticate,
  authorize,
} from "../middlewares/authentication.middlewares.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, createBidSpace)
  .get(authenticate, getBidSpaces);

router
  .route("/:id")
  .get(authenticate, getBidSpaceById)
  .put(authenticate, updateBidSpace)
  .delete(authenticate, deleteBidSpace);

export default router;
