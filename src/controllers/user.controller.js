import { User } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import { validationResult } from "express-validator";

export const getUsers = async (req, res) => {
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

    res.status(StatusCodes.OK).json({ status: "success", users: users });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
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

export const getRenters = async (req, res) => {
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

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array()[0].msg });
    }

    const user = await User.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    await user.destroy();

    return res.status(StatusCodes.OK).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
