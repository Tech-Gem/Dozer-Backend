const User = require("../models").User;
const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");

exports.getUsers = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array()[0].msg });
    }

    const users = await User.findAll({
      where: {
        role: "user", // Fetch users whose role is 'user'
      },
    });

    if (!users || users.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No users found" });
    }

    const filteredUsers = users.filter(
      (user) => user.email !== process.env.ADMIN_EMAIL
    );

    res
      .status(StatusCodes.OK)
      .json({ status: "success", users: filteredUsers });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array()[0].msg });
    }

    let user = await User.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: "User not found" });
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      user,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.getRenters = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array()[0].msg });
    }

    const users = await User.findAll({
      where: {
        role: "renter", // Fetch users whose role is 'renter'
      },
    });

    if (!users || users.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No renters found" });
    }

    res.status(StatusCodes.OK).json({ status: "success", users });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
