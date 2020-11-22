import { config } from "dotenv";
config();

module.exports = {
  HOST: process.env.Host,
  USER: process.env.User,
  PASSWORD: process.env.Password,
  DB: process.env.Database,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    rejectUnauthorized: false,
  },
};
