import express from "express";
import { verifyToken } from "../middlewares/auth/auth.middleware";
import FundingController from "../controllers/funding.controller";
import validate from "../helpers/validator";
var crypto = require("crypto");

const router = express.Router();

router.post(
  "/fundAccount",
  verifyToken.verify,
  validate.validateBody(validate.schemas.fundAccountSchema),
  FundingController.fundAccount
);

export default router;
