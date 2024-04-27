import { Bidding, Equipment } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import moment from "moment"; // Import moment.js for date manipulation

export const createBidding = async (req, res) => {
  try {
    const {
      equipmentId,
      title,
      description,
      duration,
      image,
      company,
      priceWeight,
      qualityWeight,
    } = req.body;

    if (
      !equipmentId ||
      !title ||
      !description ||
      !duration ||
      !image ||
      !company ||
      priceWeight === undefined ||
      qualityWeight === undefined
    ) {
      return res.status(400).json({
        msg: "All fields and weights are required",
      });
    }
    const user = req.user;

    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) {
      return res.status(404).json({
        msg: "Equipment not found",
      });
    }

    const startDate = moment(); // Current date and time
    const endDate = moment(startDate).add(duration, "days"); // Calculate end date

    const bidding = await Bidding.create({
      ...req.body,

      startDate: startDate,
      endDate: endDate,
      userId: user.id,
    });

    // Automatically close the bid on the end date
    setTimeout(async () => {
      await closeBidding(bidding.id);
    }, endDate.diff(startDate)); // Set timeout based on duration

    return res.status(201).json({ status: "success", bidding });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: error.message || "Internal server error",
    });
  }
};

// Function to close bidding
const closeBidding = async (biddingId) => {
  try {
    const bidding = await Bidding.findByPk(biddingId);
    if (bidding) {
      bidding.status = "closed";
      await bidding.save();
      console.log(`Bidding ${bidding.id} closed.`);
    }
  } catch (error) {
    console.error("Error closing bidding:", error);
  }
};

// Function to push duration
export const pushDuration = async (req, res) => {
  try {
    const { biddingId, additionalDuration } = req.body;
    const bidding = await Bidding.findByPk(biddingId);
    if (!bidding) {
      return res.status(404).json({
        msg: "Bidding not found",
      });
    }
    const currentEndDate = moment(bidding.endDate);
    const newEndDate = currentEndDate.add(additionalDuration, "days");
    bidding.endDate = newEndDate;
    await bidding.save();
    return res
      .status(200)
      .json({ msg: "Duration pushed successfully", newEndDate });
  } catch (error) {
    console.error("Error pushing duration:", error);
    return res.status(500).json({ msg: error.message });
  }
};

export const getAllBiddings = async (req, res) => {
  try {
    const biddings = await Bidding.findAll();
    res.status(200).json({ status: "success", biddings });
  } catch (error) {
    console.error("Error in getAllBiddings:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array()[0].msg });
  }
};

export const getBiddingById = async (req, res) => {
  try {
    const bidding = await Bidding.findByPk(req.params.id);
    if (!bidding) {
      return res.status(404).json({ error: "Bidding not found" });
    } else {
      return res.status(200).json(bidding);
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const updateBidding = async (req, res) => {
  try {
    const [updated] = await Bidding.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedBidding = await Bidding.findByPk(req.params.id);
      return res.status(200).json({ status: "success", updatedBidding });
    } else {
      return res.status(404).json({ error: "Bidding not found" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteBidding = async (req, res) => {
  try {
    const deleted = await Bidding.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      return res
        .status(StatusCodes.OK)
        .json({ status: "success", message: "Bidding deleted successfully" });
    } else {
      return res.status(404).json({ error: "Bidding not found" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
