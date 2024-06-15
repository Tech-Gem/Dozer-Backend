import { v4 as uuidv4 } from "uuid";
import faker from "faker";
import db from "../models";

export const seedUserProfiles = async (userIds) => {
  const userProfiles = [];

  userIds.forEach((userId) => {
    userProfiles.push({
      id: uuidv4(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      jobTitle: faker.name.jobTitle(),
      verifiedRenter: faker.datatype.boolean(),
      image: faker.image.avatar(),
      userId: userId,
    });
  });

  await db.UserProfile.bulkCreate(userProfiles);
};
