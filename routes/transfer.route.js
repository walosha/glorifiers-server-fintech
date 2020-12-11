import express from "express";
import { verifyToken } from "../middlewares/auth/auth.middleware";
import TransferController from "../controllers/transfer.controller";
import validate from "../helpers/validator";

const router = express.Router();

router.post(
  "/add_account_details",
  verifyToken.verify,
  validate.validateBody(validate.schemas.bankDetailSchema),
  TransferController.addAccountToDB
);

export default router;
