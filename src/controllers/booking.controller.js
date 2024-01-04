const { Booking, Equipment } = require("../models");
const { StatusCodes } = require("http-status-codes");

exports.createBooking = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      legalDocument,
      guideline,
      bookings,
      status,
      payment,
    } = req.body;

    const equipment = await Equipment.findByPk(equipmentId);

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    const booking = await Booking.create({
      fullName,
      email,
      phoneNumber,
      legalDocument,
      guideline,
      bookings,
      status,
      payment,
    });

    res.status(StatusCodes.OK).json({ booking });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    
    if (!booking) {
      throw new Error("Booking not found");
    }

    res.status(StatusCodes.OK).json({ booking });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};


exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.destroy({
      where: { id },
    });

    if (deleted) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Booking deleted successfully" });
    }

    throw new Error("Booking not found");
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

