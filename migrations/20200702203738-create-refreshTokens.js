module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("RefreshTokens", {
      token: { type: Sequelize.STRING },
      expires: { type: Sequelize.DATE },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      createdByIp: { type: Sequelize.STRING },
      revoked: { type: Sequelize.DATE },
      revokedByIp: { type: Sequelize.STRING },
      replacedByToken: { type: Sequelize.STRING },
      isExpired: {
        type: Sequelize.DATE,
        get() {
          return Date.now() >= this.expires;
        },
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        get() {
          return !this.revoked && !this.isExpired;
        },
      },
    }),
  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable("RefreshTokens"),
};
