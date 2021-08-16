module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Wallets", {
      id: {
        type: Sequelize.DOUBLE,
        required: true,
        primaryKey: true,
      },
      customerId: {
        type: Sequelize.UUID,
        unique: true,
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id",
          as: "customerId",
        },
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
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.dropTable("Wallets"),
      queryInterface.changeColumn("Wallets", "id", {
        type: Sequelize.DOUBLE,
        required: true,
        primaryKey: true,
      }),
    ]);
  },
};
