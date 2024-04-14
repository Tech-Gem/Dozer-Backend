const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const CustomError = require("../errors");
const { User, UserProfile, Otp } = require("../models");
const { Op } = require("sequelize");

const userRegistration = async (req, res, next) => {
  try {
    const { email, password, phoneNumber, fullName } = req.body;

    // Check if all required fields are provided
    if (!email || !password || !phoneNumber || !fullName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the user already exists with the provided email or phone number
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists with the provided email or phone number",
      });
    }

    //check from Otp if the phoneNumberVerified is true
    const userOtp = await Otp.findOne({ where: { phoneNumber } });
    if (!userOtp) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userOtp.phoneNumberVerified === false) {
      return res.status(400).json({ error: "Authentication Failed " });
    }

    // Proceed with the registration process
    const newUser = await User.create({
      email,
      password,
      phoneNumber,
      role: "user",
    });

    // Create UserProfile associated with the newly created User
    const userProfile = await UserProfile.create({
      userId: newUser.id,
      fullName,
    });

    await userOtp.update({ userId: newUser.id });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: token,
      user: newUser,
      userProfile,
    });
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    let user = await User.scope("withPassword").findOne({
      where: { phoneNumber },
    });
    if (!user) {
      throw new CustomError("Invalid credentials", httpStatus.UNAUTHORIZED);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new CustomError("Invalid credentials", httpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    user = user.toJSON();
    delete user.password;

    res.status(httpStatus.OK).json({ status: "success", token, user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userRegistration,
  userLogin,
};
