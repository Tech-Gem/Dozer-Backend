import express from "express";
const router = express.Router();

import {
  createReview,
  getEquipmentReviews,
  editReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { authenticate } from "../middlewares/authentication.middlewares.js";

router.post("/", authenticate, createReview);

router.get("/:equipmentId", authenticate, getEquipmentReviews);
router.put("/:reviewId", authenticate, editReview);
router.delete("/:reviewId", authenticate, deleteReview);

export default router;
