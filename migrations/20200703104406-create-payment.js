module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Payments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      amount: {
        type: Sequelize.DOUBLE,
        required: true,
      },
      reference: {
        type: Sequelize.STRING,
        required: true,
      },
      transfer_code: {
        type: Sequelize.STRING,
        required: true,
      },
      email: {
        type: Sequelize.STRING,
        required: true,
      },
      name: {
        type: Sequelize.STRING,
        required: true,
      },
      account_name: {
        type: Sequelize.STRING,
        required: true,
      },
      account_number: {
        type: Sequelize.STRING,
        required: true,
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable("Payments"),
};
