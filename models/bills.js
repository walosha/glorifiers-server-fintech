module.exports = (sequelize, DataTypes) => {
  const Bill = sequelize.define(
    "Bill",
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
      description: {
        type: DataTypes.STRING,
        required: true,
      },
      amount: {
        type: DataTypes.STRING,
        required: true,
      },
      status: {
        type: DataTypes.STRING,
        require: true,
      },
    },
    {}
  );
  Bill.associate = (models) => {
    Bill.belongsTo(models.User, {
      foreignKey: "customerId",
    });
  };
  return Bill;
};
