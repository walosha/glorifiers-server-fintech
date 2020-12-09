module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      image: {
        type: Sequelize.STRING,
        defaultValue: "noImage.png",
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      acceptTerms: { type: Sequelize.BOOLEAN },
      verificationToken: { type: Sequelize.STRING },
      verified: { type: Sequelize.DATE },
      resetToken: { type: Sequelize.STRING },
      resetTokenExpires: { type: Sequelize.DATE },
      passwordReset: { type: Sequelize.DATE },
      isVerified: {
        type: Sequelize.BOOLEAN,
        get() {
          return !!(this.verified || this.passwordReset);
        },
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated: { type: Sequelize.DATE },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable("Users"),
};
