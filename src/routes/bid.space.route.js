import express from "express";
import {
  createBidSpace,
  getBidSpaces,
  getBidSpaceById,
  updateBidSpace,
  deleteBidSpace,
} from "../controllers/bid.space.controller.js";
import { authenticate, authorize } from "../middlewares/authentication.middlewares.js";

const router = express.Router();

router
  .route("/")
  .post(authenticate, authorize("renter"), createBidSpace)
  .get(authenticate, authorize("renter"), getBidSpaces);

router
  .route("/:id")
  .get(authenticate, authorize("renter"), getBidSpaceById)
  .put(authenticate, authorize("renter"), updateBidSpace)
  .delete(authenticate, authorize("renter"), deleteBidSpace);

export default router;
