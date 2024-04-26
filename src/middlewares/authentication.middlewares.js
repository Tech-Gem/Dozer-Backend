import { User } from "../models/index.js";
import jwt from "jsonwebtoken";
import CustomError from "../errors/index.js";
import { UNAUTHORIZED } from "http-status-codes";

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError("Authentication Invalid", UNAUTHORIZED);
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(payload.id);
    next();
  } catch (error) {
    throw new CustomError("Authentication invalid", UNAUTHORIZED);
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  console.log("authorize");

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

export { authenticate, authorize };
