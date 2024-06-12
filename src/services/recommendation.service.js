import _ from "lodash";
import db from "../models/index.js";

const weights = {
  bookingFrequency: 10,
  categoryMatch: 5,
  rating: 7,
  rentalFrequency: 5,
};

const calculateWeight = async (
  booking,
  userCategories,
  equipmentRatings,
  rentalFrequencies
) => {
  const equipmentItem = await db.Equipment.findOne({
    where: { id: booking.equipmentId },
  });
  let score = 0;

  // Booking frequency
  score += weights.bookingFrequency;

  // Category match
  if (userCategories.includes(equipmentItem.category)) {
    score += weights.categoryMatch;
  }

  // Rating
  score += (weights.rating * (equipmentRatings[equipmentItem.id] || 0)) / 5; // assuming ratings are out of 5

  // Rental frequency
  score += weights.rentalFrequency * (rentalFrequencies[equipmentItem.id] || 0);

  return score;
};

const getTopRecommendations = async (
  userBookings,
  userCategories,
  equipmentRatings,
  rentalFrequencies
) => {
  const recommendations = await Promise.all(
    userBookings.map(async (booking) => {
      const weight = await calculateWeight(
        booking,
        userCategories,
        equipmentRatings,
        rentalFrequencies
      );
      return [booking.equipmentId, weight];
    })
  );

  const groupedRecommendations = _.chain(recommendations)
    .groupBy(([equipmentId]) => equipmentId)
    .map((items, equipmentId) => {
      const totalScore = _.sumBy(items, ([, weight]) => weight);
      return { id: equipmentId, score: totalScore };
    })
    .sortBy("score")
    .reverse()
    .take(10)
    .value();

  const recommendedEquipments = await Promise.all(
    groupedRecommendations.map(async ({ id, score }) => {
      const equipment = await db.Equipment.findOne({ where: { id } });
      return { ...equipment.dataValues, score };
    })
  );

  return recommendedEquipments;
};

const getFallbackRecommendations = async (
  equipmentRatings,
  rentalFrequencies
) => {
  const allEquipments = await db.Equipment.findAll();

  const recommendations = allEquipments.map((equipment) => {
    const ratingScore =
      (weights.rating * (equipmentRatings[equipment.id] || 0)) / 5;
    const rentalFrequencyScore =
      weights.rentalFrequency * (rentalFrequencies[equipment.id] || 0);
    const score = ratingScore + rentalFrequencyScore;

    return { ...equipment.dataValues, score };
  });

  return _.chain(recommendations).sortBy("score").reverse().take(10).value();
};

export { getTopRecommendations, getFallbackRecommendations };
