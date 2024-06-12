import db from "../models/index.js";
import {
  getTopRecommendations,
  getFallbackRecommendations,
} from "../services/recommendation.service.js";

const getEquipmentRatings = async () => {
  const equipments = await db.Equipment.findAll();
  const ratings = {};

  for (const equipment of equipments) {
    ratings[equipment.id] = equipment.rating || 0; // Assuming `rating` field exists on Equipment model
  }

  return ratings;
};

const getRentalFrequencies = async () => {
  const bookings = await db.Booking.findAll();
  const frequencies = {};

  for (const booking of bookings) {
    if (!frequencies[booking.equipmentId]) {
      frequencies[booking.equipmentId] = 0;
    }
    frequencies[booking.equipmentId] += 1;
  }

  return frequencies;
};

export const getRecommendationsForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await db.User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userBookings = await db.Booking.findAll({ where: { userId } });
    const userCategories = await Promise.all(
      userBookings.map(async (booking) => {
        const equipment = await db.Equipment.findOne({
          where: { id: booking.equipmentId },
        });
        return equipment.category;
      })
    );

    const equipmentRatings = await getEquipmentRatings();
    const rentalFrequencies = await getRentalFrequencies();

    let recommendations;
    if (userBookings.length > 0) {
      recommendations = await getTopRecommendations(
        userBookings,
        userCategories,
        equipmentRatings,
        rentalFrequencies
      );
    } else {
      recommendations = await getFallbackRecommendations(
        equipmentRatings,
        rentalFrequencies
      );
    }

    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
