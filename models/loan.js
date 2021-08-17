module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define(
    "Loan",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        required: true,
        primaryKey: true,
      },
      description: {
        type: DataTypes.STRING,
        required: true,
      },
      amount: {
        type: DataTypes.DOUBLE,
        required: true,
      },
      status: {
        type: DataTypes.ENUM(["pending", "accepted", "reject", "processing"]),
        defaultValue: "pending",
        required: true,
      },
      installements: {
        type: DataTypes.DOUBLE,
        required: true,
        default: 1,
      },
      guarantor1: {
        type: DataTypes.UUID,
        required: true,
      },
      guarantor2: {
        type: DataTypes.UUID,
        required: true,
        required: true,
      },
    },
    {}
  );
  Loan.associate = (models) => {
    Loan.belongsTo(models.User, {
      foreignKey: "id",
      as: "customerId",
    });
  };
  return Loan;
};
