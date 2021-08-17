module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Loans", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        required: true,
        primaryKey: true,
      },
      description: {
        type: Sequelize.STRING,
        required: true,
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id",
          as: "customerId",
        },
      },
      amount: {
        type: Sequelize.DOUBLE,
        required: true,
      },
      status: {
        type: Sequelize.ENUM(["pending", "accepted", "reject", "processing"]),
        defaultValue: "pending",
        required: true,
      },
      installements: {
        type: Sequelize.DOUBLE,
        required: true,
        default: 1,
      },
      guarantor1: {
        type: Sequelize.UUID,
        required: true,
      },
      guarantor2: {
        type: Sequelize.UUID,
        required: true,
        required: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable("Loans"),
};
