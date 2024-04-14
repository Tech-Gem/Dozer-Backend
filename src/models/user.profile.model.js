"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User, {
        foreignKey: "userId", // Adjust the foreign key according to your model definition
        onDelete: "CASCADE",
      });
    }
  }
  UserProfile.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      fullName: DataTypes.STRING,
      jobTitle: DataTypes.STRING,
      verifiedRenter: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Assuming renter verification is initially false
      },
      image: DataTypes.STRING,
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
      modelName: "UserProfile",
      tableName: "user_profiles",
    }
  );
  return UserProfile;
};
