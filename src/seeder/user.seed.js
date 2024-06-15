import { v4 as uuidv4 } from "uuid";
import faker from "faker";
import db from "../models/index.js";

export const testUsers = [
  {
    phoneNumber: "0912640427",
    email: "Christinahailu123@gmail.com",
    password: "hello1234",
    firstName: "Christina",
    lastName: "Hailu",
    role: "user",
  },
  {
    phoneNumber: "0904431921",
    email: "Hiwotderese123@gmail.com",
    password: "hello1234",
    firstName: "Hiwot",
    lastName: "Derese",
    role: "renter",
  },
  {
    phoneNumber: "0925898533",
    email: "Hayattofik123@gmail.com",
    password: "hello1234",
    firstName: "Hayat",
    lastName: "Tofik",
    role: "user",
  },
];

export const seedTestUsers = async () => {
  try {
    const users = testUsers.map((user) => ({
      ...user,
      id: uuidv4(),
    }));

    for (let user of users) {
      const [existingUser, created] = await db.User.findOrCreate({
        where: { email: user.email },
        defaults: user,
      });
      if (!created) {
        console.log(`User with email ${user.email} already exists.`);
      }
    }

    console.log("Test users seeded successfully.");
  } catch (error) {
    console.error("Error seeding test users:", error);
  }
};

export const seedUsers = async () => {
  const roles = ["user", "renter"];
  const users = [];

  for (let i = 0; i < 10; i++) {
    users.push({
      id: uuidv4(),
      role: faker.random.arrayElement(roles),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phoneNumber: faker.phone.phoneNumber(),
    });
  }

  await db.User.bulkCreate(users);
  const createdUsers = await db.User.findAll({ attributes: ["id", "role"] });
  const userIds = createdUsers.map((user) => user.id);
  const renterIds = createdUsers
    .filter((user) => user.role === "renter")
    .map((user) => user.id);
  return { userIds, renterIds };
};
