/* eslint-disable indent */
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
const cron = require("node-cron");
import env from "dotenv";
import userRoute from "./routes/user.route";
import walletRoute from "./routes/wallet.route";
import transactionRoute from "./routes/transaction.route";
import transferRoute from "./routes/transfer.route";
import loanRoute from "./routes/loan.route";
import fundingRoute from "./routes/funding.route";
import globalErrorController from "./controllers/error.controller";

// cron.schedule("15 * * * * *", function () {
//   console.log("---------------------");
//   console.log("Running Cron Job");
// });

env.config();
const port = process.env.PORT || 3000;
const app = express();

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

app.use(bodyParser.json());
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
// app.use("/api/v1/", transferRoute);

app.get("/", (req, res) => {
  res.send(`<h1> hello world</h1>`);
});

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
