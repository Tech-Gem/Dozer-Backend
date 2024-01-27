const { Equipment, RenterProfile } = require("../models");
const { StatusCodes } = require("http-status-codes");
const { uploadToCloudinary } = require("../middlewares/multer.middlewares");

exports.createEquipment = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      throw new Error("Image buffer not found");
    }

    const folderName = "equipment";

    // Upload the image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      folderName
    );

    console.log("Token Payload:", req.user);

    const renterId = req.user.id;

    if (!renterId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Renter ID not found" });
    }

    const renterProfile = await RenterProfile.findOne({
      where: { renterId },
    });

    if (!renterProfile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Renter profile not found" });
    }

    // Create Equipment in your database with the Cloudinary URL
    const equipment = await Equipment.create({
      ...req.body,
      image: cloudinaryResult.secure_url,
      renterProfileId: renterProfile.id, // Assign the ID of the found renter profile
    });

    await renterProfile.addEquipment(equipment);

    res.status(StatusCodes.OK).json({ status: "success", equipment });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

exports.getAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.findAll();
    res.status(StatusCodes.OK).json({ status: "success", equipments });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array()[0].msg });
  }
};

exports.getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findByPk(id);
    res.status(StatusCodes.OK).json({ status: "success", equipment });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// exports.getAllAvailableEquipments = async (req, res) => {
//   try {
//     const availableEquipments = await Equipment.findAll({
//       where: {
//         isBooked: false, // Fetch only available equipment
//       },
//     });
//     res.status(StatusCodes.OK).json({ status: "success", availableEquipments });
//   } catch (error) {
//     res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array()[0].msg });
//   }
// };

// exports.searchEquipment = async (req, res) => {
//   try {
//     const { name, availabilityStartDate, availabilityEndDate, location } =
//       req.query;
//     const equipments = await Equipment.findAll({
//       where: {
//         name: name ? name : undefined,
//         availabilityStartDate: availabilityStartDate
//           ? availabilityStartDate
//           : undefined,
//         availabilityEndDate: availabilityEndDate
//           ? availabilityEndDate
//           : undefined,
//         location: location ? location : undefined,
//       },
//     });
//     res.status(StatusCodes.OK).json({ equipments });
//   } catch (error) {
//     res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
//   }
// };

exports.searchEquipmentByLocation = async (req, res) => {
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

exports.searchEquipmentByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    console.log("category", category);
    const equipments = await Equipment.findAll({
      where: { category },
    });
    res.status(StatusCodes.OK).json({ status: "success", equipments });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Equipment.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedEquipment = await Equipment.findByPk(id);
      return res
        .status(StatusCodes.OK)
        .json({ status: "success", updatedEquipment });
    }
    throw new Error("Equipment not found");
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

exports.deleteEquipment = async (req, res) => {
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
