import { Bidder, Bidding } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
// Function to submit a bid
export const submitBid = async (req, res) => {
  try {
    const {
      biddingId,
      firstName,
      lastName,
      email,
      phone,
      offerPrice,
      offerDescription,
      condition,
    } = req.body;

    if (
      !biddingId ||
      !firstName ||
      !lastName ||
      !email ||
      !offerPrice ||
      !offerDescription ||
      !condition
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "All fields are required",
      });
    }
    const user = req.user;

    const existBid = await Bidding.findByPk(biddingId);

    if (!existBid || existBid.status === "closed") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Bid is closed or not found",
      });
    }

    const bid = await Bidder.create({
      biddingId,
      firstName,
      lastName,
      email,
      phone,
      offerPrice,
      offerDescription,
      condition,
      userId: user.id,
    });

    return res.status(StatusCodes.CREATED).json({ status: "success", bid });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message || "Internal server error",
    });
  }
};

export const determineWinningBidder = async (req, res) => {
  try {
    const { biddingId } = req.params;

    if (!biddingId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "No Bidding Selected",
      });
    }

    // Fetch the bidding details to get the user's price and quality weights
    const bidding = await Bidding.findByPk(biddingId);

    if (!bidding) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Bidding not found",
      });
    }

    const { priceWeight, qualityWeight } = bidding;

    // Fetch all bidders for the specified bidding
    const bidders = await Bidder.findAll({
      where: { biddingId },
    });

    // Calculate weighted scores for each bidder
    const weightedScores = bidders.map((bidder) => {
      // Assign weights to different conditions
      const conditionWeights = {
        "Best Condition": 0.9,
        "Good Condition": 0.7,
        "Fair Condition": 0.5,
        "Poor Condition": 0.3,
      };

      // Calculate score based on offer price and condition
      const priceScore = bidder.offerPrice * priceWeight;
      const conditionScore = conditionWeights[bidder.condition] * qualityWeight;
      const totalScore = priceScore + conditionScore;

      return { bidderId: bidder.id, score: totalScore };
    });

    // Determine the winning bidder
    let winningBidder = null;
    let highestScore = -Infinity;

    weightedScores.forEach(({ bidderId, score }) => {
      if (score > highestScore) {
        highestScore = score;
        winningBidder = bidderId;
      }
    });

    if (!winningBidder) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "No winning bidder found",
      });
    }

    // Update the winning bidder's status to "win" in the database
    const winningBidderInfo = await Bidder.findByPk(winningBidder);
    const winningBidderScore = weightedScores.find(
      (bidder) => bidder.bidderId === winningBidder
    ).score;

    return res.status(StatusCodes.OK).json({
      msg: "Winning bidder determined successfully",
      winningBidder: winningBidderInfo,
      score: winningBidderScore,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message || "Internal server error",
    });
  }
};
//get winner bidder
export const getWinningBidder = async (req, res) => {
  try {
    const { biddingId } = req.params;

    // Check if the bid is closed
    const bidding = await Bidding.findByPk(biddingId);
    if (!bidding || bidding.status !== "closed") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Bidding is not closed yet",
      });
    }

    // Fetch all bidders of the closed bid
    const bidders = await Bidder.findAll({
      where: { biddingId },
    });

    // Find the winning bidder
    const winningBidder = bidders.find(
      (bidder) => bidder.winningStatus === "win"
    );

    if (!winningBidder) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Winning bidder not found",
      });
    }

    return res
      .status(StatusCodes.OK)
      .json({ status: "success", winner: winningBidder });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message || "Internal server error",
    });
  }
};

export const getAllBidders = async (req, res) => {
  try {
    const { biddingId } = req.params;

    if (!biddingId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Bidding ID is required",
      });
    }

    const bidders = await Bidder.findAll({
      where: { biddingId },
    });

    return res.status(StatusCodes.OK).json({ status: "success", bidders });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message || "Internal server error",
    });
  }
};
