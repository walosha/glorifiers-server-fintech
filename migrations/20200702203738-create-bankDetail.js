module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("BankDetails", {
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
      account_number: {
        type: Sequelize.DOUBLE,
        required: true,
      },
      bvn: {
        type: Sequelize.DOUBLE,
        required: true,
      },
      bank_code: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable("BankDetails"),
};
