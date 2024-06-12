import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Equipment extends Model {
    static associate(models) {
      Equipment.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Equipment.hasMany(models.Booking, {
        foreignKey: "equipmentId",
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
      rating: {
        type: DataTypes.DECIMAL(2, 1),
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
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
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
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      transportation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isBooked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
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

