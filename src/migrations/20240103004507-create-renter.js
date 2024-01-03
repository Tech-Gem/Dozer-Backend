'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('renters', {
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
      profilePicture: Sequelize.STRING,
      company: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      ownedEquipmentIds: {
        type: Sequelize.ARRAY(Sequelize.UUID), // Assuming Equipment IDs are UUIDs
        allowNull: true,
        defaultValue: [],
      },  
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('renters');
  }
};