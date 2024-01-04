const { body } = require("express-validator");

const addEquipmentValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  // Add validations for other fields here...

  // Validate availabilityStartDate and availabilityEndDate fields
  body("availabilityStartDate")
    .notEmpty()
    .withMessage("Availability start date is required")
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Invalid availability start date format (YYYY-MM-DD)"),

  body("availabilityEndDate")
    .notEmpty()
    .withMessage("Availability end date is required")
    .isDate({ format: "YYYY-MM-DD" })
    .withMessage("Invalid availability end date format (YYYY-MM-DD)"),
];

module.exports = {
  addEquipmentValidation,
};
