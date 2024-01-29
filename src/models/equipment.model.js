"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Equipment extends Model {
    static associate(models) {
      Equipment.belongsTo(models.RenterProfile, {
        foreignKey: "renterProfileId",
        onDelete: "CASCADE",
      });
      Equipment.hasMany(models.Booking, {
        foreignKey: "equipmentId", // Adjust the foreign key according to your model definition
        onDelete: "CASCADE",
      });
    }
  }
  Equipment.init(
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
        defaultValue: "",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      pricePerHour: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      category: {
        type: DataTypes.ENUM(
          "CompactEquipment",
          "HeavyEarthmoving",
          "LiftAerialWorkPlatform",
          "RollersCompaction"
        ),
        allowNull: false,
        defaultValue: "CompactEquipment",
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      capacity: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      model: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      specifications: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Using ARRAY for list of strings
        allowNull: false,
        defaultValue: [],
      },
      transportation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Assuming default transportation value is false
      },
      isBooked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      renterProfileId: {
        type: DataTypes.UUID,
        references: {
          model: "renter_profiles",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Equipment",
      tableName: "equipments",
    }
  );
  return Equipment;
};
