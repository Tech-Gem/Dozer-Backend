import { BidSpace, UserProfile } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

export const createBidSpace = async (req, res) => {
  try {
    const { title, description, priceMin, priceMax, isHost } = req.body;

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

    res.status(201).json({ status: "success", newBid });
  } catch (error) {
    console.error("Error creating bid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
