const { User } = require("../models");
const jwt = require("jsonwebtoken");
const CustomError = require("../errors");
const httpStatus = require("http-status");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError("Authentication Invalid", httpStatus.UNAUTHORIZED);
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(payload.id);
    next();
  } catch (error) {
    throw new CustomError("Authentication invalid", httpStatus.UNAUTHORIZED);
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  console.log("authroize");

  return (req, res, next) => {
    if (!roles.includes(req.user.roleType)) {
      return next(
        new CustomError.BadRequestError(
          `${req.user.roleType} is not authorized to access this route`
        )
      );
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};