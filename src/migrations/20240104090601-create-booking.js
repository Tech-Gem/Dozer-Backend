'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      equipmentId: {
        type: Sequelize.UUID
      },
      renterId: {
        type: Sequelize.UUID
      },

      fullName:{
        type:Sequelize.STRING
      },
      email:{
      type:Sequelize.STRING,
    },
      phoneNumber:{
        type:Sequelize.STRING
      },
      legalDocument:{
        type:Sequelize.STRING
      },
      guideline:{
        type:Sequelize.BOOLEAN
      },
      bookings:{
        type:Sequelize.ENUM(
        "Refundable",
        "NonRefundable"),
    },
      status: {
        type: Sequelize.ENUM(
          "Pending",
          "Approved",
          "Re"
        )
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      payment:{
        type:Sequelize.ENUM(
        "TeleBirr",
        "Chapa")
    }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};