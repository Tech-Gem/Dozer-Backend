import { StatusCodes } from "http-status-codes";
import { Equipment, Booking } from "../models/index.js";

export const getUserFinancialReport = async (req, res) => {
  try {
    const user = req.user;
    const equipments = await Equipment.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Booking,
          as: "Bookings", // Ensure this matches the alias defined in your association
        },
      ],
    });
    let totalEquipments = equipments.length;
    let totalBookings = 0;
    let totalMoneyMade = 0;
    equipments.forEach((equipment) => {
      totalBookings += equipment.Bookings.length; // Ensure this matches the alias used above
      totalMoneyMade += equipment.Bookings.length * equipment.pricePerHour;
    });
    res.status(200).json({
      status: "success",
      totalEquipments,
      totalBookings,
      totalMoneyMade,
    });
  } catch (error) {
    console.error("Error in getUserFinancialReport:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};
