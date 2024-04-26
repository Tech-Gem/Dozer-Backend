import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User, {
        foreignKey: "userId",
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
      lastName: DataTypes.STRING,
      jobTitle: DataTypes.STRING,
      verifiedRenter: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
