import { BidSpace, UserProfile } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { StatusCodes } from "http-status-codes";

export const createBidSpace = async (req, res) => {
  try {
    const { title, description, priceMin, priceMax } = req.body;

    const userId = req.user.id;
    const user = await UserProfile.findOne({ where: { userId: userId } });
    // Generate a unique roomId
    const roomId = uuidv4();

    // Create the new BidSpace entry
    const newBid = await BidSpace.create({
      roomId,
      userName: user.firstName + " " + user.lastName,
      title,
      description,
      priceMin,
      priceMax,
      isHost: true,
      participants: [userId],
      userId: userId,
    });

    res
      .status(201)
      .json({ status: "success", newBid, profileImage: user.image });
  } catch (error) {
    console.error("Error creating bid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all BidSpaces
export const getBidSpaces = async (req, res) => {
  try {
    const bidSpaces = await BidSpace.findAll();
    res.status(200).json({ status: "success", bidSpaces });
  } catch (error) {
    console.error("Error fetching bid spaces:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a BidSpace by ID
export const getBidSpaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const bidSpace = await BidSpace.findOne({ where: { id } });

    if (!bidSpace) {
      return res.status(404).json({ error: "BidSpace not found" });
    }

    res.status(200).json({ status: "success", bidSpace });
  } catch (error) {
    console.error("Error fetching bid space:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a BidSpace
export const updateBidSpace = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priceMin, priceMax, isHost } = req.body;

    const bidSpace = await BidSpace.findOne({ where: { id } });

    if (!bidSpace) {
      return res.status(404).json({ error: "BidSpace not found" });
    }

    bidSpace.title = title || bidSpace.title;
    bidSpace.description = description || bidSpace.description;
    bidSpace.priceMin = priceMin !== undefined ? priceMin : bidSpace.priceMin;
    bidSpace.priceMax = priceMax !== undefined ? priceMax : bidSpace.priceMax;
    bidSpace.isHost = isHost !== undefined ? isHost : bidSpace.isHost;

    await bidSpace.save();

    res.status(200).json({ status: "success", bidSpace });
  } catch (error) {
    console.error("Error updating bid space:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a BidSpace
export const deleteBidSpace = async (req, res) => {
  try {
    const { id } = req.params;

    const bidSpace = await BidSpace.findOne({ where: { id } });

    if (!bidSpace) {
      return res.status(404).json({ error: "BidSpace not found" });
    }

    await bidSpace.destroy();

    res
      .status(StatusCodes.OK)
      .json({ status: "success", message: "Bid deleted successfully" });
  } catch (error) {
    console.error("Error deleting bid space:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
