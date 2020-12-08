module.exports = (sequelize, DataTypes) => {
  const BankDetail = sequelize.define(
    "BankDetail",
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
      account_number: {
        type: DataTypes.DOUBLE,
        required: true,
      },
      bank_code: {
        type: DataTypes.STRING,
        required: true,
      },
    },
    {}
  );
  BankDetail.associate = (models) => {
    BankDetail.belongsTo(models.User, {
      foreignKey: "customerId",
    });
  };
  return BankDetail;
};
