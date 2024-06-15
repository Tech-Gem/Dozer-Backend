import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class BidHistory extends Model {
    static associate(models) {
      BidHistory.belongsTo(models.RealTimeBid, {
        foreignKey: "realTimeBidsId",
        onDelete: "CASCADE",
      });
      BidHistory.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  BidHistory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      offerPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      winningStatus: {
        type: DataTypes.ENUM("neutral", "win", "lose"),
        allowNull: false,
        defaultValue: "neutral",
      },
      bidId: {
        type: DataTypes.UUID,
        references: {
          model: "realTimeBids",
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
      modelName: "BidHistory",
      tableName: "bidHistories",
    }
  );
  return BidHistory;
};
