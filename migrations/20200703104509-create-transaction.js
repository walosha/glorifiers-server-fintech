module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Transactions", {
      id: {
        type: Sequelize.UUID,
        required: true,
        primaryKey: true,
      },
      amount: {
        type: Sequelize.DOUBLE,
        required: true,
      },
      accountNumber: {
        type: Sequelize.DOUBLE,
        required: true,
      },
      type: {
        type: Sequelize.ENUM(["transfer", "debit", "funding", "loan"]),
        required: true,
      },
      narration: {
        type: Sequelize.STRING,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable("Transactions"),
};
