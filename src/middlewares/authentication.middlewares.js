import { User } from "../models/index.js";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";

// Authentication middleware
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      createError(StatusCodes.UNAUTHORIZED, "Authentication Invalid")
    );
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(payload.id);
    if (!req.user) {
      return next(createError(StatusCodes.UNAUTHORIZED, "User not found"));
    }
    next();
  } catch (error) {
    return next(
      createError(StatusCodes.UNAUTHORIZED, "Authentication Invalid")
    );
  }
};

// Authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roleType)) {
      return next(
        createError(
          StatusCodes.FORBIDDEN,
          `${req.user.roleType} is not authorized to access this route`
        )
      );
    }
    next();
  };
};

export { authenticate, authorize };
