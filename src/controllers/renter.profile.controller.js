const { User, RenterProfile, Equipment } = require("../models");
const { StatusCodes } = require("http-status-codes");
const { uploadToCloudinary } = require("../middlewares/multer.middlewares");

exports.createRenterProfile = async (req, res, next) => {
  try {
    const requiredFields = ["firstName", "lastName", "company"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      const errorMessage = `The field${
        missingFields.length > 1 ? "s" : ""
      } ${missingFields.join(" and ")} ${
        missingFields.length > 1 ? "are" : "is"
      } required`;
      return res.status(StatusCodes.BAD_REQUEST).json({ error: errorMessage });
    }

    const renterId = req.user.id;

    if (!req.file || !req.file.buffer) {
      throw new Error("Image buffer not found");
    }

    const folderName = "renterProfile";

    // Upload the image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      folderName
    );

    // Find or create the user profile associated with the user ID
    const [renterProfile, created] = await RenterProfile.findOrCreate({
      where: { renterId },
      defaults: {
        firstName: req.body.firstName,
        middleName: req.body.middleName || null,
        lastName: req.body.lastName,
        fullName: `${req.body.firstName} ${req.body.middleName} ${req.body.lastName}`,
        company: req.body.company,
        address: req.body.address || null,
        image: cloudinaryResult.secure_url || null,
      },
    });

    // If the profile was not created (i.e., it already existed), update the profile
    if (!created) {
      await renterProfile.update({
        firstName: req.body.firstName,
        middleName: req.body.middleName || null,
        lastName: req.body.lastName,
        fullName: `${req.body.firstName} ${req.body.middleName} ${req.body.lastName}`,
        company: req.body.company,
        address: req.body.address || null,
        image: cloudinaryResult.secure_url || null,
      });
    }

    res.status(StatusCodes.CREATED).json({ status: "success", renterProfile });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    next(error);
  }
};

// Function to fetch all user profiles
exports.getAllRenterProfiles = async (req, res, next) => {
  try {
    const allRenterProfiles = await RenterProfile.findAll({
      include: [
        {
          model: User,
          attributes: ["email", "phoneNumber", "phoneNumberVerified", "role"],
        },
      ],
      attributes: {
        exclude: ["renterId"],
      },
    });

    // Customized response object
    const formattedrenterProfiles = allRenterProfiles.map((profile) => {
      return {
        id: profile.id,
        fullName: profile.fullName,
        firstName: profile.firstName,
        middleName: profile.middleName,
        lastName: profile.lastName,
        company: profile.company,
        address: profile.address,
        image: profile.image,
        email: profile.User.email,
        isVerified: profile.isVerified,
        phoneNumber: profile.User.phoneNumber,
        phoneNumberVerified: profile.User.phoneNumberVerified,
        role: profile.User.role,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      };
    });

    res
      .status(StatusCodes.OK)
      .json({ status: "success", formattedrenterProfiles });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    next(error);
  }
};

// Function to get a specific user profile by ID
exports.getRenterProfileById = async (req, res, next) => {
  try {
    const { id } = req.params; // Assuming you receive the profile ID from the request parameters

    const renterProfile = await RenterProfile.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["email", "phoneNumber", "phoneNumberVerified", "role"],
        },
      ],
      attributes: {
        exclude: ["renterId"],
      },
    });

    if (!renterProfile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Renter profile not found" });
    }

    // Customized response object
    const formattedProfile = {
      id: renterProfile.id,
      fullName: renterProfile.fullName,
      firstName: renterProfile.firstName,
      middleName: renterProfile.middleName,
      lastName: renterProfile.lastName,
      company: renterProfile.company,
      address: renterProfile.address,
      image: renterProfile.image,
      createdAt: renterProfile.createdAt,
      updatedAt: renterProfile.updatedAt,
      email: renterProfile.User.email,
      isVerified: profile.isVerified,
      phoneNumber: renterProfile.User.phoneNumber,
      phoneNumberVerified: renterProfile.User.phoneNumberVerified,
      role: renterProfile.User.role,
    };

    res.status(StatusCodes.OK).json({ status: "success", formattedProfile });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    next(error);
  }
};

exports.getRenterEquipment = async (req, res, next) => {
  try {
    const { renterId } = req.params;

    // Check if the renter ID exists
    const renterProfile = await RenterProfile.findOne({
      where: { id: renterId },
    });
    if (!renterProfile) {
      return res.status(404).json({ error: "Renter ID not found" });
    }

    // Get the associated equipment for the renter
    const renterEquipment = await Equipment.findAll({
      where: { renterProfileId: renterId },
    });

    res.status(200).json({ renterEquipment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to update a user profile by ID
exports.updateRenterProfile = async (req, res, next) => {
  try {
    const { id } = req.params; // Assuming you receive the profile ID from the request parameters
    const updateFields = req.body; // Assuming you receive the updated fields in the request body

    const renterProfile = await RenterProfile.findByPk(id);

    if (!renterProfile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Renter profile not found" });
    }

    // Update the user profile fields
    await renterProfile.update(updateFields);

    const updatedProfile = await RenterProfile.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["email", "phoneNumber", "phoneNumberVerified", "role"],
        },
      ],
      attributes: {
        exclude: ["renterId"],
      },
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      updatedProfile,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    next(error);
  }
};

exports.deleteRenterProfile = async (req, res, next) => {
  try {
    const { id } = req.params; // Assuming you receive the profile ID from the request parameters

    const renterProfile = await RenterProfile.findByPk(id);

    if (!renterProfile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Renter profile not found" });
    }

    // Delete the user profile
    await renterProfile.destroy();

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Renter profile deleted successfully",
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    next(error);
  }
};
