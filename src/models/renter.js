"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Renter extends Model {
    static associate(models) {
      Renter.hasMany(models.Equipment, {
        foreignKey: "renterId",
        onDelete: "CASCADE",
      });
    }
  }
  Renter.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: DataTypes.STRING,
      middleName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      fullName: {
        type: DataTypes.STRING,
        get() {
          return `${this.firstName} ${this.middleName} ${this.lastName}`;
        },
      },
      profilePicture: DataTypes.STRING,
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      ownedEquipmentIds: {
        type: DataTypes.ARRAY(DataTypes.UUID), // Assuming Equipment IDs are UUIDs
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: "Renter",
      tableName: "renters",
    }
  );
  return Renter;
};
