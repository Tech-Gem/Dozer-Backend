import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Bidding extends Model {
    static associate(models) {
      Bidding.belongsTo(models.Equipment, {
        foreignKey: "equipmentId",
        onDelete: "CASCADE",
      });
      Bidding.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Bidding.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
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
      priceWeight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.5, // Default weight for price
      },
      qualityWeight: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.5, // Default weight for quality
      },
      status: {
        type: DataTypes.ENUM("Open", "closed"),
        allowNull: false,
        defaultValue: "Open",
      },
      image: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      equipmentId: {
        type: DataTypes.UUID,
        references: {
          model: "equipments",
          key: "id",
        },
        onDelete: "CASCADE",
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
      modelName: "Bidding",
      tableName: "biddings",
    }
  );
  return Bidding;
};
