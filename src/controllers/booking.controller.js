const { Booking, Equipment } = require("../models");
const { StatusCodes } = require("http-status-codes");

exports.bookEquipment = async (req, res) => {
  try {
    const {
      equipmentId,
      name,
      email,
      startDate,
      endDate,
      quantity,
      signature,
      termsAndConditions,
    } = req.body;

    // Check if equipment exists
    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    // Create booking
    const booking = await Booking.create({
      name,
      email,
      startDate,
      endDate,
      quantity,
      signature,
      termsAndConditions,
      equipmentId: equipment.id,
    });

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json({ status: "success", bookings });
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array()[0].msg });
  }
};
