module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define(
    "RefreshToken",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        required: true,
        primaryKey: true,
      },
      token: { type: DataTypes.STRING },
      expires: { type: DataTypes.DATE },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      createdByIp: { type: DataTypes.STRING },
      revoked: { type: DataTypes.DATE },
      revokedByIp: { type: DataTypes.STRING },
      replacedByToken: { type: DataTypes.STRING },
      isExpired: {
        type: DataTypes.DATE,
        get() {
          return Date.now() >= this.expires;
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        get() {
          return !this.revoked && !this.isExpired;
        },
      },
    },
    {
      // disable default timestamp fields (createdAt and updatedAt)
      timestamps: false,
    }
  );

  return RefreshToken;
};
