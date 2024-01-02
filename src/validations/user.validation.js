const { body } = require("express-validator");

const addUserValidation = [
  body("email").isEmail().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  body("role").notEmpty().withMessage("Role is required"),
];

module.exports = {
  addUserValidation,
};
