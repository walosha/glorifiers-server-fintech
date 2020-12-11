module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        required: true,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.UUID,
        required: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        required: true,
      },
      reference: {
        type: DataTypes.STRING,
        required: true,
      },
      transfer_code: {
        type: DataTypes.STRING,
        required: true,
      },
      email: {
        type: DataTypes.STRING,
        required: true,
      },
      name: {
        type: DataTypes.STRING,
        required: true,
      },
      account_name: {
        type: DataTypes.STRING,
        required: true,
      },
      account_number: {
        type: DataTypes.STRING,
        required: true,
      },
    },
    {}
  );
  Payment.associate = (models) => {
    Payment.belongsTo(models.User, {
      foreignKey: "customerId",
    });
  };
  return Payment;
};
