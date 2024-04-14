const axios = require("axios");
const { User, Otp } = require("../models");

exports.sendSecurityCode = async (req, res, next) => {
  const phoneNumber = req.session.phoneNumber;

  try {
    let userOtp = await Otp.findOne({ where: { phoneNumber } });

    if (!userOtp) {
      userOtp = await Otp.create({ phoneNumber });
    }

    const baseURL = "https://api.afromessage.com/api/challenge";
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoicVJKRnFwU3RyaHYzYmdtMmt3MFg4M1NCWTFqRmtjY3YiLCJleHAiOjE4NjE5ODg2ODUsImlhdCI6MTcwNDEzNTg4NSwianRpIjoiNzljYTgyM2UtOGY2MS00YTU3LWI2Y2QtNDU5ZmQ2MTg4MDc4In0.rwaI7asbS0pYEgm5EENxYgP3RwKwZE0Vg4kEcvH_n5w";
    const callback = "http://localhost:4000/api/v1/otp/sendOtp"; // Your callback URL
    const from = "e80ad9d8-adf3-463f-80f4-7c4b39f7f164";
    const sender = "Dozer";
    const to = phoneNumber; // Assuming phone number is sent in the request body
    const pre = "Hey there, your security code is:";
    const post = ". Thank you for using Dozer.";
    const sb = 1; // Spaces before
    const sa = 0; // Spaces after
    const ttl = 60; // Time to live in seconds
    const len = 6; // Code length
    const t = 0; // Code type (0 for numbers)0 for numbers)

    const url = `${baseURL}?from=${from}&sender=${sender}&to=${to}&pr=${pre}&ps=${post}&callback=${callback}&sb=${sb}&sa=${sa}&ttl=${ttl}&len=${len}&t=${t}`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Make an HTTP GET request to send the security code
    const response = await axios.get(url, { headers });

    // console.log("Response data:", response.data); // Log the response data for debugging

    if (response.data.acknowledge === "success") {
      const receivedVerificationId = response.data.response.verificationId; // Extracting verificationId from the request body
      const receivedOtpCode = response.data.response.code; // Extracting OTP code from the request body

      // Update the user with the verificationId
      await userOtp.update({
        verificationId: receivedVerificationId,
        otpCode: receivedOtpCode,
        phoneNumberVerified: false,
      });
      // Assuming the response contains the necessary information for successful sending
      res.status(200).json({
        message: "Security code sent successfully",
        response: response.data.response,
      });
    } else {
      res.status(400).json({ error: "Failed to send security code" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send security code" });
  }
};

// Function to verify the security code
exports.verifySecurityCode = async (req, res, next) => {
  const { code, phoneNumber } = req.body;

  try {
    // const phoneNumber = req.session.phoneNumber;

    const userOtp = await Otp.findOne({ where: { phoneNumber } });

    if (!userOtp) {
      return res.status(404).json({ error: "User not found" });
    }

    const baseURL = "https://api.afromessage.com/api/verify";
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoicVJKRnFwU3RyaHYzYmdtMmt3MFg4M1NCWTFqRmtjY3YiLCJleHAiOjE4NjE5ODg2ODUsImlhdCI6MTcwNDEzNTg4NSwianRpIjoiNzljYTgyM2UtOGY2MS00YTU3LWI2Y2QtNDU5ZmQ2MTg4MDc4In0.rwaI7asbS0pYEgm5EENxYgP3RwKwZE0Vg4kEcvH_n5w";
    const to = phoneNumber; // Assuming phone number is sent in the request body
    const { verificationId } = userOtp; // Replace with received verificationId
    const verificationCode = code; // Assuming verification code is sent in the request body

    const url = `${baseURL}?to=${to}&vc=${verificationId}&code=${verificationCode}`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Make an HTTP GET request to verify the security code
    const response = await axios.get(url, { headers });

    if (response.data.acknowledge === "success") {
      await userOtp.update({ phoneNumberVerified: true });
      // Assuming the verification is successful and response contains the verified details
      res.status(200).json({
        message: "Security code verified successfully",
        response: response.data.response,
      });
    } else {
      res.status(400).json({ error: "Invalid security code" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to verify security code" });
  }
};
