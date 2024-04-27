import("sequelize-cli").Migration;

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bidder", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        required: false,
      },
      offerPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      offerDescription: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
      },
      condition: {
        type: Sequelize.ENUM(
          "Best Condition",
          "Good Condition",
          "Fair Condition",
          "Poor Condition"
        ),
        allowNull: false,
        defaultValue: "Good Condition",
      },
      winningStatus: {
        type: Sequelize.ENUM("neutral", "win", "lose"),
        allowNull: false,
        defaultValue: "neutral",
      },
      bidderId: {
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("bidder");
  },
};
