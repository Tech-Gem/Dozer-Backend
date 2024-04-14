const { Booking, Equipment, RenterProfile } = require("../models");
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
      location,
      signature,
      termsAndConditions,
    } = req.body;

    // Check if equipment exists
    const equipment = await Equipment.findByPk(equipmentId, {
      include: RenterProfile,
    });

    if (!equipment) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    // Check if the equipment is already booked
    if (equipment.isBooked) {
      return res.status(400).json({ error: "Equipment is already booked" });
    }

    // Create booking
    const booking = await Booking.create({
      name,
      email,
      startDate,
      endDate,
      quantity,
      location,
      signature,
      termsAndConditions,
      equipmentId: equipment.id,
    });

    // Update equipment's isBooked status to true
    await Equipment.update({ isBooked: true }, { where: { id: equipment.id } });

    // Send notification to the equipment owner (renter)
    const ownerFCMToken = equipment.RenterProfile.fcmToken;
    const notificationMessage = `A new booking has been confirmed for your equipment: ${equipment.name}`;
    await NotificationService.sendNotification(
      ownerFCMToken,
      notificationMessage
    );

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
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
