"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Equipment, {
        foreignKey: "equipmentId",
        onDelete: "CASCADE",
      });
    }
  }
  Booking.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        required: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        required: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      signature: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      termsAndConditions: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        required: true,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
      },
      paymentMethods: {
        type: DataTypes.ENUM("TeleBirr", "Chapa", "Cash"),
        allowNull: false,
        defaultValue: "Cash",
      },
      equipmentId: {
        type: DataTypes.UUID,
        references: {
          model: "equipments",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Booking",
      tableName: "bookings",
    }
  );
  return Booking;
};
