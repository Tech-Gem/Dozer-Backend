import { User, UserProfile } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
// import { uploadToCloudinary } from "../middlewares/multer.middlewares.js";

export const createUserProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, jobTitle, image } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const existingUserProfile = await UserProfile.findOne({
      where: { userId },
    });

    if (existingUserProfile) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User profile already exists" });
    }

    const newUserProfile = await UserProfile.create({
      userId,
      firstName,
      lastName,
      jobTitle,
      image,
    });

    res.status(StatusCodes.CREATED).json({
      status: "success",
      newUserProfile,
    });
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
          attributes: ["email", "phoneNumber", "isSubscribed"],
        },
      ],
      attributes: {
        exclude: ["userId"],
      },
    });

    const formattedUserProfiles = allUserProfiles.map((profile) => {
      return {
        id: profile.id,
        fullName: `${profile.firstName} ${profile.lastName}`,
        firstName: profile.firstName,
        lastName: profile.lastName,
        jobTitle: profile.jobTitle,
        image: profile.image,
        email: profile.User.email,
        phoneNumber: profile.User.phoneNumber,
        isSubscribed: profile.User.isSubscribed,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      };
    });

    res
      .status(StatusCodes.OK)
      .json({ status: "success", userProfiles: formattedUserProfiles });
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
          attributes: ["email", "phoneNumber", "isSubscribed"],
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

    const formattedProfile = {
      id: userProfile.id,
      fullName: `${userProfile.firstName} ${userProfile.lastName}`,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      jobTitle: userProfile.jobTitle,
      image: userProfile.image,
      email: userProfile.User.email,
      phoneNumber: userProfile.User.phoneNumber,
      isSubscribed: userProfile.User.isSubscribed,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
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
