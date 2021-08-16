module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Wallets", {
      id: {
        type: Sequelize.DOUBLE,
        required: true,
        primaryKey: true,
      },
      accountNumber: {
        type: Sequelize.DOUBLE,
        required: true,
        unique: true,
      },
      balance: {
        type: Sequelize.DOUBLE,
        required: true,
      },
      type: {
        type: Sequelize.ENUM(["customer", "company"]),
        required: true,
        defaultValue: "customer",
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable("Wallets"),
};
