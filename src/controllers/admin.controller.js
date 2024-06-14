import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js"; // Adjust the path based on your project structure

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.scope("withPassword").findOne({
      where: { email, role: "admin" },
    });
    if (!user) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyRenter = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userProfile = await UserProfile.findOne({
      where: { userId: id },
    });

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    if (!user.isSubscribed) {
      return res.status(400).json({
        error: "User must be subscribed to verify as a renter",
      });
    }

    user.role = "renter";
    userProfile.verifiedRenter = true;

    await user.save();
    await userProfile.save();

    res.json({ message: "User account verified as renter successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
