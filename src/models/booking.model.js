import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Equipment, {
        foreignKey: "equipmentId",
        onDelete: "CASCADE",
      });
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Booking.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      equipmentName: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      equipmentPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
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
      
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      signature: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      termsAndConditions: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        required: true,
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
      modelName: "Booking",
      tableName: "bookings",
    }
  );
  return Booking;
};
