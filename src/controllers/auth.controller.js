const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const CustomError = require("../errors");
const { User } = require("../models");

const register = async (req, res, next) => {
  try {
    const { role, email, password } = req.body;
    const user = await User.create({
      role,
      email,
      password,
    });
    res.status(httpStatus.CREATED).json(user);
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
