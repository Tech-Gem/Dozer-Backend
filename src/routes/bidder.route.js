// biddingRoutes.js
import express from "express";
import {
  submitBid,
  determineWinningBidder,
  getWinningBidder,
  getAllBidders,
} from "../controllers/bidder.controller.js";
import { authenticate } from "../middlewares/authentication.middlewares.js";

const router = express.Router();

router.route("/:biddingId").get(authenticate, getAllBidders);
router.route("/submit-bid").post(authenticate, submitBid);
router
  .route("/determine-winning-bid/:biddingId")
  .post(authenticate, determineWinningBidder);
router.route("/get-winning-bidder/:biddingId").get(authenticate, getWinningBidder);

export default router;
