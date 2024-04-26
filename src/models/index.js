import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import process from "process";
import dbConfig from "../config/config.json" assert { type: "json" };
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

const { Sequelize: SequelizeClass, Op } = Sequelize;
const basename = path.basename(new URL(import.meta.url).pathname);
const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new SequelizeClass(process.env[config.use_env_variable], config);
} else {
  sequelize = new SequelizeClass(
    config.database,
    config.username,
    config.password,
    config
  );
}

const modelFiles = fs
  .readdirSync(path.resolve(path.dirname(new URL(import.meta.url).pathname)))
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1 &&
      file !== "index.js" // Exclude the index.js file itself
    );
  });

for (const file of modelFiles) {
  const modelModule = await import(
    path.join(
      path.resolve(path.dirname(new URL(import.meta.url).pathname)),
      file
    )
  );
  const model = modelModule.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the models explicitly
export const Equipment = db.Equipment;
export const Booking = db.Booking;
export const User = db.User;
export const UserProfile = db.UserProfile;
export const Otp = db.Otp;
export const Notification = db.Notification;

export default db;

export const getUsers = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array()[0].msg });
    }

    const users = await db.User.findAll({
      where: {
        role: "user", // Fetch users whose role is 'user'
      },
    });

    if (!users || users.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No users found" });
    }

    const filteredUsers = users.filter(
      (user) => user.email !== process.env.ADMIN_EMAIL
    );

    res
      .status(StatusCodes.OK)
      .json({ status: "success", users: filteredUsers });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
