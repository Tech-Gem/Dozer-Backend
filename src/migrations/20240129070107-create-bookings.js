"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        required: true,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
        required: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
      },
      signature: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
      },
      termsAndConditions: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        required: true,
      },
      status: {
        type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
      },
      paymentMethods: {
        type: Sequelize.ENUM("TeleBirr", "Chapa", "Cash"),
        allowNull: false,
        defaultValue: "Cash",
      },
      equipmentId: {
        type: Sequelize.UUID,
        references: {
          model: "equipments",
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
    await queryInterface.dropTable("bookings");
  },
};
