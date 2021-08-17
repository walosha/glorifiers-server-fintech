const { config } = require("dotenv");
config();

module.exports = {
  url: process.env.POSTGRESQL_DATABASE_URL,
  HOST: process.env.Host,
  USER: process.env.User,
  PASSWORD: process.env.Password,
  DB: process.env.Database,
  dialect: "postgres",
  dialectOptions: {
    ssl: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
