"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const EquipmentCategory = {
    CompactEquipment: "CompactEquipment",
    HeavyEarthmoving: "HeavyEarthmoving",
    LiftAerialWorkPlatform: "LiftAerialWorkPlatform",
    RollersCompaction: "RollersCompaction",
  };

  class Equipment extends Model {
    static associate(models) {
      Equipment.belongsTo(models.Renter, {
        foreignKey: "renterId",
        onDelete: "CASCADE",
      });
    }
  }
  class Equipment extends Model {
    static associate(models) {
      Equipment.hasMany(models.Booking, {
        foreignKey: 'equipmentId',
        onDelete: 'CASCADE',
      });
    }
  }
  
  Equipment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
          EquipmentCategory.CompactEquipment,
          EquipmentCategory.HeavyEarthmoving,
          EquipmentCategory.LiftAerialWorkPlatform,
          EquipmentCategory.RollersCompaction
        ),
        allowNull: false,
        defaultValue: EquipmentCategory.CompactEquipment,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
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
      availabilityStartDate: {
        type: DataTypes.DATE,
        allowNull: true, // Adjust allowNull as needed
      },
      availabilityEndDate: {
        type: DataTypes.DATE,
        allowNull: true, // Adjust allowNull as needed
      },
      renterId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Adjust allowNull as needed
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
