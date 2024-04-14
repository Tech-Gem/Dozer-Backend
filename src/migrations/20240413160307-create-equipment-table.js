"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("equipments", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      pricePerHour: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      category: {
        type: Sequelize.ENUM(
          "CompactEquipment",
          "HeavyEarthmoving",
          "LiftAerialWorkPlatform",
          "RollersCompaction"
        ),
        allowNull: false,
        defaultValue: "CompactEquipment",
      },
      image: {
        type: Sequelize.ARRAY(Sequelize.STRING), // Using ARRAY for list of strings
        allowNull: true,
        defaultValue: [],
      },
      capacity: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      specifications: {
        type: Sequelize.ARRAY(Sequelize.STRING), // Using ARRAY for list of strings
        allowNull: false,
        defaultValue: [],
      },
      transportation: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isBooked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
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
    await queryInterface.dropTable("equipments");
  },
};
