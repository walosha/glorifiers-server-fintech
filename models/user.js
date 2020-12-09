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
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        required: true,
      },
      image: {
        type: DataTypes.STRING,
        defaultValue: "noImage.png",
      },
      password: {
        type: DataTypes.STRING,
        required: true,
      },

      acceptTerms: { type: DataTypes.BOOLEAN },
      verificationToken: { type: DataTypes.STRING },
      verified: { type: DataTypes.DATE },
      resetToken: { type: DataTypes.STRING },
      resetTokenExpires: { type: DataTypes.DATE },
      passwordReset: { type: DataTypes.DATE },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        get() {
          return !!(this.verified || this.passwordReset);
        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        required: true,
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated: { type: DataTypes.DATE },
    },
    {
      // disable default timestamp fields (createdAt and updatedAt)
      timestamps: false,
      defaultScope: {
        // exclude password hash by default
        attributes: { exclude: ["password", "verificationToken"] },
      },
      scopes: {
        // include hash with this scope
        withHash: { attributes: {} },
      },
    }
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
