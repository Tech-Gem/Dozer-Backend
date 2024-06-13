import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Review.belongsTo(models.Equipment, {
        foreignKey: "equipmentId",
        onDelete: "CASCADE",
      });
    }
  }
  Review.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
      },
      equipmentId: {
        type: DataTypes.UUID,
        references: {
          model: "equipments",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "reviews",
    }
  );
  return Review;
};
