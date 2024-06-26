import faker from "faker";
import db from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

// Function to truncate strings to a specified length
const truncateString = (str, maxLength) => {
  return str.length > maxLength ? str.substring(0, maxLength) : str;
};

export const seedBidSpaces = async () => {
  const users = await db.User.findAll();
  const usersProfiles = await db.UserProfile.findAll();

  if (users.length === 0) {
    console.error("No users available for seeding BidSpaces.");
    return;
  }

  if (usersProfiles.length === 0) {
    console.error("No user profiles available for seeding BidSpaces.");
    return;
  }

  const bidSpaces = [];

  for (let i = 0; i < 10; i++) {
    const user = faker.random.arrayElement(users);
    const userProfile = usersProfiles.find(
      (profile) => profile.userId === user.id
    );

    if (!userProfile) {
      console.error(`No profile found for user with ID: ${user.id}`);
      continue;
    }

    const roomId = uuidv4();

    bidSpaces.push({
      id: uuidv4(),
      userName: truncateString(
        `${userProfile.firstName} ${userProfile.lastName}`,
        255
      ),
      roomId,
      title: truncateString(faker.commerce.productName(), 255),
      description: truncateString(faker.lorem.paragraph(), 255),
      priceMin: faker.commerce.price(10, 50, 2),
      priceMax: faker.commerce.price(51, 100, 2),
      status: "Open",
      isHost: true,
      participants: [user.id],
      userId: user.id,
    });
  }

  await db.BidSpace.bulkCreate(bidSpaces);
  console.log("BidSpaces have been successfully seeded.");
};
