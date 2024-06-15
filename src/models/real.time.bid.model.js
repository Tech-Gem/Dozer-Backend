import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class RealTimeBid extends Model {
    static associate(models) {
      RealTimeBid.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  RealTimeBid.init(
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
      modelName: "RealTimeBid",
      tableName: "realTimeBids",
    }
  );
  return RealTimeBid;
};
