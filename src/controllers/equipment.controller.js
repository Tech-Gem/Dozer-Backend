const { Equipment } = require("../models");
const { StatusCodes } = require("http-status-codes");

const multer = require("multer");
const path = require("path");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/equipment/images");
  },
  filename: function (req, file, cb) {
    const filename = `profile-${Date.now()}${path.extname(file.originalname)}`;
    if (!req.body.imageUrl) {
      req.body.imageUrl = filename;
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

exports.uploadImage = upload.single("imageUrl");

exports.createEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.create({
      ...req.body,
      // renterId: req.user.id,
    });
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

exports.searchEquipment = async (req, res) => {
  try {
    const { name, availabilityStartDate, availabilityEndDate, location } =
      req.query;
    const equipments = await Equipment.findAll({
      where: {
        name: name ? name : undefined,
        availabilityStartDate: availabilityStartDate
          ? availabilityStartDate
          : undefined,
        availabilityEndDate: availabilityEndDate
          ? availabilityEndDate
          : undefined,
        location: location ? location : undefined,
      },
    });
    res.status(StatusCodes.OK).json({ equipments });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

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
