"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_profiles", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      firstName: Sequelize.STRING,
      middleName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      fullName: {
        type: Sequelize.STRING,
        get() {
          return `${this.firstName} ${this.middleName} ${this.lastName}`;
        },
      },
      jobTitle: Sequelize.STRING,
      profilePicture: Sequelize.STRING,
      userId: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_profiles");
  },
};
