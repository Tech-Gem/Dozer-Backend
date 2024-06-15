import faker from "faker";
import db from "../models";
import { v4 as uuidv4 } from "uuid";

export const seedBookings = async () => {
  const equipments = await db.Equipment.findAll();
  const users = await db.User.findAll();
  const usersProfiles = await db.UserProfile.findAll();

  if (equipments.length === 0) {
    console.error("No equipment available for seeding bookings.");
    return;
  }

  if (users.length === 0) {
    console.error("No users available for seeding bookings.");
    return;
  }

  const bookings = [];

  for (let i = 0; i < 10; i++) {
    const equipment = faker.random.arrayElement(equipments);
    const user = faker.random.arrayElement(users);
    const userProfile = faker.random.arrayElement(usersProfiles);

    bookings.push({
      id: uuidv4(),
      equipmentName: equipment.name,
      equipmentPrice: equipment.pricePerHour,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: user.email,
      startDate: faker.date.recent(),
      endDate: faker.date.future(),
      quantity: faker.datatype.number({ min: 1, max: equipment.quantity }),
      location: equipment.location,
      signature: faker.lorem.word(),
      termsAndConditions: faker.datatype.boolean(),
      txRef: uuidv4(),
      paymentStatus: faker.random.arrayElement([
        "Pending",
        "Approved",
        "Rejected",
      ]),
      equipmentId: equipment.id,
      userId: user.id,
    });
  }

  await db.Booking.bulkCreate(bookings);
};
