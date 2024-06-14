import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {
      Subscription.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Subscription.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      subscriptionType: {
        type: DataTypes.ENUM("Basic", "Standard", "Premium"),
        allowNull: false,
      },
      subscriptionDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      subscriptionStatus: {
        type: DataTypes.ENUM(
          "Active",
          "Canceled",
          "Expired",
          "Suspended",
          "inActive"
        ),
        allowNull: false,
        defaultValue: "inActive",
      },
      txRef: {
        type: DataTypes.STRING,
        required: true,
      },
      paymentStatus: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
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
      modelName: "Subscription",
      tableName: "subscriptions",
    }
  );
  return Subscription;
};
