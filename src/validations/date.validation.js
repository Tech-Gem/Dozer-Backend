const moment = require("moment");

const validateAndParseDate = (date) => {
  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    throw new Error("Invalid date format. Please use YYYY-MM-DD.");
  }
  return moment(date).format("YYYY-MM-DD");
};

module.exports = {
  validateAndParseDate,
};
