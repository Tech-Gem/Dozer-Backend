const { UserProfile } = require("../models");
const { StatusCodes } = require("http-status-codes");

const multer = require("multer");
const path = require("path");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/user/profile");
  },
  filename: function (req, file, cb) {
    const filename = `profile-${Date.now()}${path.extname(file.originalname)}`;
    if (!req.body.profilePicture) {
      req.body.profilePicture = filename;
    }
    cb(null, filename);
  },
});

const multerFilter = function (req, file, cb) {
  // Modify this function according to your allowed file types for profile pictures
  if (
    file.mimetype.startsWith("image/jpeg") ||
    file.mimetype.startsWith("image/png") ||
    file.mimetype.startsWith("image/jpg")
  ) {
    cb(null, true);
  } else {
    cb(new AppError("Invalid image format", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}); // Change the field name to match the input field in your form

exports.uploadProfilePicture = upload.single("profilePicture");

// Function to create user profile
exports.createUserProfile = async (req, res, next) => {
  try {
    // Check if the required fields for the user profile are present in the request body
    const requiredFields = ["firstName", "lastName", "jobTitle"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      const errorMessage = `The field${
        missingFields.length > 1 ? "s" : ""
      } ${missingFields.join(" and ")} ${
        missingFields.length > 1 ? "are" : "is"
      } required`;
      return res.status(StatusCodes.BAD_REQUEST).json({ error: errorMessage });
    }

    // Retrieve user ID from the authenticated user (assuming it's stored in req.user.id)
    const userId = req.user.id; // Modify this line based on how you're storing the user ID after login

    // Find or create the user profile associated with the user ID
    const [userProfile, created] = await UserProfile.findOrCreate({
      where: { userId },
      defaults: {
        firstName: req.body.firstName,
        middleName: req.body.middleName || null,
        lastName: req.body.lastName,
        fullName: `${req.body.firstName} ${req.body.middleName} ${req.body.lastName}`,
        jobTitle: req.body.jobTitle,
        profilePicture: req.body.profilePicture || null,
      },
    });

    // If the profile was not created (i.e., it already existed), update the profile
    if (!created) {
      await userProfile.update({
        firstName: req.body.firstName,
        middleName: req.body.middleName || null,
        lastName: req.body.lastName,
        fullName: `${req.body.firstName} ${req.body.middleName} ${req.body.lastName}`,
        jobTitle: req.body.jobTitle,
        profilePicture: req.body.profilePicture || null,
      });
    }

    res.status(StatusCodes.CREATED).json(userProfile);
  } catch (error) {
    next(error);
  }
};
