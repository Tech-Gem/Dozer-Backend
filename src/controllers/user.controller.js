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

    let users = await User.findAll();

    if (users)
      users = users.filter((user) => user.email !== process.env.ADMIN_EMAIL);

    res.status(StatusCodes.OK).json({ status: "success", users });
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

    let user = await User.findByPk(id);

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: "User not found" });
    }

    return res.status(StatusCodes.OK).json({
      user,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

