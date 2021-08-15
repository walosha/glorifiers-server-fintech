module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        required: true,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        required: true,
      },
      accountNumber: {
        type: DataTypes.UUID,
        required: true,
      },
      type: {
        type: DataTypes.ENUM([
          "transfer",
          "debit",
          "funding",
          "loan",
          "charges",
          "interestOnLoan",
        ]),
        required: true,
      },
      narration: {
        type: DataTypes.STRING,
        required: true,
      },
    },
    {}
  );
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Wallet, {
      foreignKey: "accountNumber",
    });
  };
  return Transaction;
};
