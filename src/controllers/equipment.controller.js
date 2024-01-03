const { Equipment } = require("../models");
const { StatusCodes } = require("http-status-codes");

exports.createEquipment = async (req, res, next) => {
  try {
    const { name, quantity, pricePerHour, location, description, category } =
      req.body;
    const equipment = await Equipment.create({
      name,
      quantity,
      pricePerHour,
      location,
      description,
      category,
    });
    res.status(StatusCodes.OK).json({ equipment });
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
    const { location } = req.query;
    const equipments = await Equipment.findAll({
      where: { location },
    });
    res.status(StatusCodes.OK).json({ equipments });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

exports.getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await Equipment.findByPk(id);
    res.status(StatusCodes.OK).json({ equipment });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

exports.searchEquipmentByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const equipments = await Equipment.findAll({
      where: { category },
    });
    res.status(StatusCodes.OK).json({ equipments });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

exports.getAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.findAll();
    res.status(StatusCodes.OK).json({ equipments });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array()[0].msg });
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
      return res.status(StatusCodes.OK).json({ updatedEquipment });
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
        .json({ message: "Equipment deleted successfully" });
    }
    throw new Error("Equipment not found");
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};
