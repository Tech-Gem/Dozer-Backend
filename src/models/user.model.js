"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.UserProfile, {
        foreignKey: "userId", // Adjust the foreign key according to your model definition
        onDelete: "CASCADE",
      });
      User.hasMany(models.Notification, {
        foreignKey: "userId", // Adjust the foreign key according to your model definition
        onDelete: "CASCADE",
      });
      User.hasMany(models.Booking, {
        foreignKey: "userId", // Adjust the foreign key according to your model definition
        onDelete: "CASCADE",
      });
      User.hasMany(models.Equipment, {
        foreignKey: "userId", // Adjust the foreign key according to your model definition
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        required: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        required: true,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM,
        values: ["admin", "user", "renter"],
        defaultValue: "user",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      hooks: {
        beforeCreate: (user) => {
          if (user.changed("password")) {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeBulkCreate: (users) => {
          for (const user of users) {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeUpdate: (user) => {
          if (user.changed("password")) {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeBulkUpdate: (users) => {
          for (const user of users) {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
      },
      defaultScope: {
        attributes: {
          exclude: ["password"],
        },
      },
      scopes: {
        withPassword: {
          attributes: {
            include: ["password"],
          },
        },
      },
    }
  );
  return User;
};
