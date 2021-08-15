/* eslint-disable indent */
import path from "path";
import express, { request } from "express";
import morgan from "morgan";
const cors = require("cors");
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cron = require("node-cron");
import env from "dotenv";
import userRoute from "./routes/user.route";
import walletRoute from "./routes/wallet.route";
import transactionRoute from "./routes/transaction.route";
import transferRoute from "./routes/transfer.route";
import paymentRoute from "./routes/payment.route";
import loanRoute from "./routes/loan.route";
import fundingRoute from "./routes/funding.route";
import ViewRoute from "./routes/view.route";
import globalErrorController from "./controllers/error.controller";

// cron.schedule("15 * * * * *", function () {
//   console.log("---------------------");
//   console.log("Running Cron Job");
// });

env.config();
const port = process.env.PORT || 3000;
const app = express();

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());

app.use(
  cors({
    origin: "https://glorifiers.ng",
  })
);
app.options("*", cors());

//added helmet to app
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 20 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE.ENV !== "production") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Routes here
app.use("/api/v1/", userRoute);
app.use("/api/v1/", walletRoute);
app.use("/api/v1/", loanRoute);
app.use("/api/v1/", transactionRoute);
app.use("/api/v1/", fundingRoute);
app.use("/api/v1/", transferRoute);
app.use("/api/v1/", paymentRoute);
app.use("/", ViewRoute);

app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "You have entered an incorrect route",
  });
});

app.use(globalErrorController);

app
  .listen(port, () => console.log(`Welcome, listening on ${port}`))
  .on("error", (err) => {
    if (err.syscall !== "listen") {
      throw err;
    }
    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
    // handle specific listen errors with friendly messages

    switch (err.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw err;
    }
  });

export default app;
