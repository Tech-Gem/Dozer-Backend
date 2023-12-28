const { authenticate, authorize } = require("./authentication");
const errorHandlerMiddleware = require("./errorHandler");

module.exports = {
  authenticate,
  authorize,
  errorHandlerMiddleware,
};
