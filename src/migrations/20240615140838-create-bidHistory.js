import("sequelize-cli").Migration;

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bidHistories", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      offerPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        required: true,
      },
      winningStatus: {
        type: Sequelize.ENUM("neutral", "win", "lose"),
        allowNull: false,
        defaultValue: "neutral",
      },
      bidId: {
        type: Sequelize.UUID,
        references: {
          model: "realTimeBids",
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
    await queryInterface.dropTable("bidHistories");
  },
};
