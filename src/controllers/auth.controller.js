const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const CustomError = require("../errors");
const { User, UserProfile } = require("../models");
const { Op } = require("sequelize");

const register = async (req, res, next) => {
  try {
    const requiredFields = ["role", "email", "password", "phoneNumber"];
    const missingFields = [];

    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      const errorMessage = `The field${
        missingFields.length > 1 ? "s" : ""
      } ${missingFields.join(" and ")} ${
        missingFields.length > 1 ? "are" : "is"
      } required`;

      return res.status(httpStatus.BAD_REQUEST).json({
        error: errorMessage,
      });
    }

    const { role, email, password, phoneNumber } = req.body;

    // Check if the user already exists with the provided email or phone number
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
    });

    if (existingUser) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: "User already exists with the provided email or phone number",
      });
    }

    // Create a new user if it doesn't exist
    const newUser = await User.create({
      role,
      email,
      password,
      phoneNumber,
    });

    // Create UserProfile associated with the newly created User
    const userProfile = await UserProfile.create({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      jobTitle: req.body.jobTitle,
      profilePicture: req.body.profilePicture,
      userId: newUser.id, // Link UserProfile to the newly created User
    });

    res.status(httpStatus.CREATED).json({ user: newUser, userProfile });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.scope("withPassword").findOne({ where: { email } });
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

    res.status(httpStatus.OK).json({ token, user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
