import bcrypt from "bcrypt";
import { User, Otp } from "../models/index.js"; // Assuming index.js exports both User and Otp models
import { sendSecurityCode, verifySecurityCode } from "./otp.controller.js"; // Import OTP related functions

export const resetPassword = async (req, res) => {
  try {
    const { phoneNumber, newPassword } = req.body;

    const userOtp = await Otp.findOne({ where: { phoneNumber } });
    const user = await User.findOne({ where: { phoneNumber } });

    if (!user || !userOtp) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the phone number is verified
    if (!userOtp.phoneNumberVerified) {
      return res.status(400).json({ error: "Failed to Authenticate" });
    }

    // OTP verification successful, reset the password
    await user.update({ password: await bcrypt.hash(newPassword, 10) });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};
