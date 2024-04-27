import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Bidder extends Model {
    static associate(models) {
      Bidder.belongsTo(models.Bidding, {
        foreignKey: "biddingId",
        onDelete: "CASCADE",
      });
      Bidder.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Bidder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        required: false,
      },
      offerPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      offerDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      condition: {
        type: DataTypes.ENUM(
          "Best Condition",
          "Good Condition",
          "Fair Condition",
          "Poor Condition"
        ),
        allowNull: false,
        defaultValue: "Good Condition",
      },
      winningStatus: {
        type: DataTypes.ENUM("neutral", "win", "lose"),
        allowNull: false,
        defaultValue: "neutral",
      },
      biddingId: {
        type: DataTypes.UUID,
        references: {
          model: "biddings",
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
      modelName: "Bidder",
      tableName: "bidders",
    }
  );
  return Bidder;
};
