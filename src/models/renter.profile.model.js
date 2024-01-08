"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RenterProfile extends Model {
    static associate(models) {
      RenterProfile.belongsTo(models.User, {
        foreignKey: "renterId", // Adjust the foreign key according to your model definition
        onDelete: "CASCADE",
      });
      RenterProfile.hasMany(models.Equipment, {
        foreignKey: "renterProfileId", // Adjust the foreign key according to your model definition
        onDelete: "CASCADE",
      });
    }
  }
  RenterProfile.init(
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
      image: DataTypes.STRING,
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      renterId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "RenterProfile",
      tableName: "renter_profiles",
    }
  );
  return RenterProfile;
};
