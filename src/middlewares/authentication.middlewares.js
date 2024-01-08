const { User, UserProfile, RenterProfile } = require("../models");
const jwt = require("jsonwebtoken");
const CustomError = require("../errors");
const httpStatus = require("http-status");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Authentication Invalid" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "User not found" });
    }

    req.renter = { id: user.id }; // Set req.renter with the user ID
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Authentication invalid" });
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
