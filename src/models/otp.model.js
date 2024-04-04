"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    static associate(models) {
      Otp.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Otp.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumberVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      otpCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verificationId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Otp",
      tableName: "otps",
    }
  );
  return Otp;
};
