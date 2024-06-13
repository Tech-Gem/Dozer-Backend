// biddingRoutes.js
import express from "express";
import {
  createBidSpace,
  getBidSpaces,
  getBidSpaceById,
  updateBidSpace,
  deleteBidSpace,
} from "../controllers/bid.space.controller.js";
import { authenticate } from "../middlewares/authentication.middlewares.js";

const router = express.Router();

router.route("/").post(authenticate, createBidSpace).get(getBidSpaces);
router
  .route("/:id")
  .get(getBidSpaceById)
  .put(authenticate, updateBidSpace)
  .delete(authenticate, deleteBidSpace);

export default router;
