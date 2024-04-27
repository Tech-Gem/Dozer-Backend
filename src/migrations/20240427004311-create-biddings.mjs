import("sequelize-cli").Migration;

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("biddings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        required: true,
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
      priceWeight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.5,
      },
      qualityWeight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.5,
      },
      status: {
        type: Sequelize.ENUM("Open", "closed"),
        allowNull: false,
        defaultValue: "Open",
      },
      image: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: [],
      },
      company: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "",
      },
      equipmentId: {
        type: Sequelize.UUID,
        references: {
          model: "equipments",
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
    await queryInterface.dropTable("biddings");
  },
};
