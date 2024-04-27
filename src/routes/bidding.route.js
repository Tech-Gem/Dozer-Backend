// biddingRoutes.js
import express from "express";
import {
  createBidding,
  pushDuration,
  getAllBiddings,
  getBiddingById,
  updateBidding,
  deleteBidding,
} from "../controllers/bidding.controller.js";
import { authenticate } from "../middlewares/authentication.middlewares.js";

const router = express.Router();

router.route("/").post(authenticate, createBidding).get(getAllBiddings);
router
  .route("/:id")
  .get(getBiddingById)
  .patch(authenticate, updateBidding)
  .delete(authenticate, deleteBidding);

router.route("/push-duration").post(pushDuration);

export default router;
