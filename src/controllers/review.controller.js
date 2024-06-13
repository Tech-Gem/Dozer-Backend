import express from "express";
import db from "../models/index.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

// Add a review
export const createReview = async (req, res) => {
  const { rating, comment, equipmentId } = req.body;

  try {
    const userId = req.user.id;
    const user = await db.User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const equipment = await db.Equipment.findOne({
      where: { id: equipmentId },
    });
    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    const review = await db.Review.create({
      rating,
      comment,
      userId: userId,
      equipmentId,
    });

    res.status(201).json({ status: "success", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get reviews for an equipment
export const getEquipmentReviews = async (req, res) => {
  const { equipmentId } = req.params;

  try {
    const reviews = await db.Review.findAll({ where: { equipmentId } });
    res.json({ status: "success", reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Edit a review
export const editReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await db.Review.findOne({ where: { id: reviewId } });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    review.rating = rating !== undefined ? rating : review.rating;
    review.comment = comment !== undefined ? comment : review.comment;

    await review.save();
    res.json({ status: "success", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await db.Review.findOne({ where: { id: reviewId } });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    await review.destroy();
    res
      .status(StatusCodes.OK)
      .json({ status: "success", message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
