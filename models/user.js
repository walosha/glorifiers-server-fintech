import { hashPassword } from "../helpers/utils";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        required: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        required: true,
      },
      lastName: {
        type: DataTypes.STRING,
        required: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        required: true,
      },
      image: {
        type: DataTypes.STRING,
        defaultValue:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        required: true,
        validate: {
          isEmail: {
            msg: "Email field must be an email.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        required: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        required: true,
      },
    },
    {}
  );
  User.associate = (models) => {
    User.hasMany(models.Transaction, {
      foreignKey: "id",
      as: "transactionId",
    });

    User.hasOne(models.Wallet, {
      foreignKey: "customerId",
      as: "walletId",
    });
    User.beforeCreate(async (newUser) => {
      newUser.password = "" || hashPassword(newUser.password);
    });
  };
  return User;
};
