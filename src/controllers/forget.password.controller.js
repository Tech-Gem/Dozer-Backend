const bcrypt = require("bcrypt");
const { User, Otp } = require("../models");
const { sendSecurityCode, verifySecurityCode } = require("./otp.controller"); // Import OTP related functions

exports.resetPassword = async (req, res) => {
  try {
    const { phoneNumber, newPassword } = req.body;

    const userOtp = await Otp.findOne({ where: { phoneNumber } });
    const user = await User.findOne({ where: { phoneNumber } });

    if (!user || !userOtp) {
      return res.status(404).json({ error: "User not found" });
    }

    // check if the phone number is verified
    if (!userOtp.phoneNumberVerified) {
      return res.status(400).json({ error: "Failed to Authenticate" });
    }

    // OTP verification successful, reset the password
    await user.update({ password: newPassword });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};
