import { User, UserProfile } from "../models/index.js";

const verifyRenter = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the renter by ID
    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the verification status
    const user_profile = await UserProfile.findOne({
      where: { userId: id },
    });

    if (!user_profile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    user.role = "renter";
    user_profile.verifiedRenter = true;

    await user.save();
    await user_profile.save();

    res.json({ message: "User account verified to Renter successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default verifyRenter;
