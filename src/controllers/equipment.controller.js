import { User, Equipment, UserProfile } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
// import { uploadToCloudinary } from "../middlewares/multer.middlewares.js";

export const createEquipment = async (req, res, next) => {
  try {
    const {
      name,
      quantity,
      pricePerHour,
      location,
      description,
      category,
      image,
      capacity,
      model,
      specifications,
      transportation,
    } = req.body;

    const user = req.user;

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "User not found" });
    }

    const equipment = await Equipment.create({
      name,
      quantity,
      pricePerHour,
      location,
      description,
      category,
      image,
      capacity,
      model,
      specifications,
      transportation,
      userId: user.id,
    });

    res.status(StatusCodes.OK).json({ status: "success", equipment });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const getAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.findAll({
      include: [
        {
          model: User,
          attributes: ["phoneNumber"],
          include: [
            {
              model: UserProfile,
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
    });

    const formattedEquipments = equipments.map((equipment) => {
      return {
        id: equipment.id,
        name: equipment.name,
        quantity: equipment.quantity,
        pricePerHour: equipment.pricePerHour,
        rating: equipment.rating,
        location: equipment.location,
        description: equipment.description,
        category: equipment.category,
        image: equipment.image,
        capacity: equipment.capacity,
        model: equipment.model,
        specifications: equipment.specifications,
        transportation: equipment.transportation,
        isBooked: equipment.isBooked,
        phoneNumber: equipment.User ? equipment.User.phoneNumber : null,
        owner:
          equipment.User && equipment.User.UserProfile
            ? `${equipment.User.UserProfile.firstName} ${equipment.User.UserProfile.lastName}`
            : null,
      };
    });

    res.status(StatusCodes.OK).json({ status: "success", formattedEquipments });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};
export const getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["phoneNumber"], // Include only the phone number
        },
      ],
    });

    if (!equipment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Equipment not found" });
    }

    res.status(StatusCodes.OK).json({ status: "success", equipment });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const getAllUserEquipments = async (req, res) => {
  try {
    const userId = req.user.id;

    const equipments = await Equipment.findAll({
      where: { userId },
    });

    res.status(StatusCodes.OK).json({ status: "success", equipments });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const getAllAvailableEquipments = async (req, res) => {
  try {
    const availableEquipments = await Equipment.findAll({
      where: {
        isBooked: false,
      },
    });
    res.status(StatusCodes.OK).json({ status: "success", availableEquipments });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array()[0].msg });
  }
};

export const searchEquipmentByLocation = async (req, res) => {
  try {
    const location = req.params.location;
    const equipments = await Equipment.findAll({
      where: { location },
    });
    res.status(StatusCodes.OK).json({ status: "success", equipments });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const searchEquipmentByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const equipments = await Equipment.findAll({
      where: { category },
    });
    res.status(StatusCodes.OK).json({ status: "success", equipments });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const filterEquipments = async (req, res) => {
  try {
    const { locations, categories } = req.body;

    let filterOptions = {};

    // Add location filter if locations are provided
    if (locations && locations.length > 0) {
      filterOptions.location = locations;
    }

    // Add category filter if categories are provided
    if (categories && categories.length > 0) {
      filterOptions.category = categories;
    }

    const filteredEquipments = await Equipment.findAll({
      where: filterOptions,
    });

    res
      .status(StatusCodes.OK)
      .json({ status: "success", equipments: filteredEquipments });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // Check if equipment exists
    const existingEquipment = await Equipment.findByPk(id);
    if (!existingEquipment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Equipment not found" });
    }

    // Update the equipment properties
    Object.assign(existingEquipment, updateFields);

    // Save the updated equipment
    await existingEquipment.save();

    res
      .status(StatusCodes.OK)
      .json({ status: "success", equipment: existingEquipment });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Equipment.destroy({
      where: { id },
    });
    if (deleted) {
      return res
        .status(StatusCodes.OK)
        .json({ status: "success", message: "Equipment deleted successfully" });
    }
    throw new Error("Equipment not found");
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};
