const { authenticate, authorize } = require("./authentication.middlewares");
const errorHandlerMiddleware = require("./errorHandler.middlewares");

module.exports = {
  authenticate,
  authorize,
  errorHandlerMiddleware,
};
