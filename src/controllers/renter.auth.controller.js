const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const CustomError = require("../errors");
const { User, RenterProfile } = require("../models");
const { Op } = require("sequelize");

const renterRegistration = async (req, res, next) => {
  try {
    const requiredFields = ["email", "password"];
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

    const { email, password } = req.body;

    // Check if the user already exists with the provided email or phone number
    const existingRenter = await User.findOne({
      where: {
        [Op.or]: [{ email }],
      },
    });

    if (existingRenter) {
      return res.status(httpStatus.BAD_REQUEST).json({
        error: "User already exists with the provided email",
      });
    }

    // Create a new user if it doesn't exist
    const newRenter = await User.create({
      email,
      password,
      role: "renter",
    });

    // Create renterProfile associated with the newly created User
    const renterProfile = await RenterProfile.create({
      renterId: newRenter.id, // Link renterProfile to the newly created User
    });

    res
      .status(httpStatus.CREATED)
      .json({ status: "success", renter: newRenter, renterProfile });
  } catch (error) {
    next(error);
  }
};

const renterLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let renter = await User.scope("withPassword").findOne({ where: { email } });
    if (!renter) {
      throw new CustomError("Invalid credentials", httpStatus.UNAUTHORIZED);
    }

    const isPasswordMatched = await bcrypt.compare(password, renter.password);
    if (!isPasswordMatched) {
      throw new CustomError("Invalid credentials", httpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign({ id: renter.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    renter = renter.toJSON();
    delete renter.password;

    res.status(httpStatus.OK).json({ status: "success", token, renter });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  renterRegistration,
  renterLogin,
};
