const User = require("../models").User;
const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");

exports.getRenters = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array()[0].msg });
    }

    const renters = await User.findAll({
      where: {
        role: "renter", // Fetch users whose role is 'user'
      },
    });

    if (!renters || renters.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No users found" });
    }

    const filteredRenters = renters.filter(
      (renter) => renter.email !== process.env.ADMIN_EMAIL
    );

    res
      .status(StatusCodes.OK)
      .json({ status: "success", users: filteredRenters });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

exports.getRenter = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array()[0].msg });
    }

    let renter = await User.findOne({
      where: {
        id,
        role: "renter",
      },
    });

    if (!renter) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: "User not found" });
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      renter,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
