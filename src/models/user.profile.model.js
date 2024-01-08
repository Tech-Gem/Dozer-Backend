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
      firstName: DataTypes.STRING,
      middleName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      fullName: {
        type: DataTypes.STRING,
        get() {
          return `${this.firstName} ${this.middleName} ${this.lastName}`;
        },
      },
      jobTitle: DataTypes.STRING,
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
