import { User, UserProfile } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
// import { uploadToCloudinary } from "../middlewares/multer.middlewares.js";

export const createUserProfile = async (req, res, next) => {
  try {
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

    const userId = req.user.id;

    if (!req.file || !req.file.buffer) {
      throw new Error("Image buffer not found");
    }

    const folderName = "userProfile";

    // Upload the image to Cloudinary
    // const cloudinaryResult = await uploadToCloudinary(
    //   req.file.buffer,
    //   folderName
    // );

    // Find or create the user profile associated with the user ID
    const [userProfile, created] = await UserProfile.findOrCreate({
      where: { userId },
      defaults: {
        firstName: req.body.firstName,
        middleName: req.body.middleName || null,
        lastName: req.body.lastName,
        fullName: `${req.body.firstName} ${req.body.middleName} ${req.body.lastName}`,
        jobTitle: req.body.jobTitle,
        image: cloudinaryResult.secure_url || null,
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
        image: cloudinaryResult.secure_url || null,
      });
    }

    res.status(StatusCodes.CREATED).json({ status: "success", userProfile });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    next(error);
  }
};

export const getAllUserProfiles = async (req, res, next) => {
  try {
    const allUserProfiles = await UserProfile.findAll({
      include: [
        {
          model: User,
          attributes: ["email", "phoneNumber", "phoneNumberVerified", "role"],
        },
      ],
      attributes: {
        exclude: ["userId"],
      },
    });

    // Customized response object
    const formattedUserProfiles = allUserProfiles.map((profile) => {
      return {
        id: profile.id,
        fullName: profile.fullName,
        firstName: profile.firstName,
        middleName: profile.middleName,
        lastName: profile.lastName,
        jobTitle: profile.jobTitle,
        image: profile.image,
        email: profile.User.email,
        phoneNumber: profile.User.phoneNumber,
        phoneNumberVerified: profile.User.phoneNumberVerified,
        role: profile.User.role,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      };
    });

    res
      .status(StatusCodes.OK)
      .json({ status: "success", formattedUserProfiles });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    next(error);
  }
};

export const getUserProfileById = async (req, res, next) => {
  try {
    const { id } = req.params; // Assuming you receive the profile ID from the request parameters

    const userProfile = await UserProfile.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["email", "phoneNumber", "phoneNumberVerified", "role"],
        },
      ],
      attributes: {
        exclude: ["userId"],
      },
    });

    if (!userProfile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User profile not found" });
    }

    // Customized response object
    const formattedProfile = {
      id: userProfile.id,
      fullName: userProfile.fullName,
      firstName: userProfile.firstName,
      middleName: userProfile.middleName,
      lastName: userProfile.lastName,
      jobTitle: userProfile.jobTitle,
      image: userProfile.image,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
      email: userProfile.User.email,
      phoneNumber: userProfile.User.phoneNumber,
      phoneNumberVerified: userProfile.User.phoneNumberVerified,
      role: userProfile.User.role,
    };

    res.status(StatusCodes.OK).json({ status: "success", formattedProfile });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params; // Assuming you receive the profile ID from the request parameters
    const updateFields = req.body; // Assuming you receive the updated fields in the request body

    const userProfile = await UserProfile.findByPk(id);

    if (!userProfile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User profile not found" });
    }

    // Update the user profile fields
    await userProfile.update(updateFields);

    const updatedProfile = await UserProfile.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["email", "phoneNumber", "phoneNumberVerified", "role"],
        },
      ],
      attributes: {
        exclude: ["userId"],
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

export const deleteUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params; // Assuming you receive the profile ID from the request parameters

    const userProfile = await UserProfile.findByPk(id);

    if (!userProfile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User profile not found" });
    }

    // Delete the user profile
    await userProfile.destroy();

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "User profile deleted successfully",
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    next(error);
  }
};
