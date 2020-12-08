import express from "express";
import { verifyToken } from "../middlewares/auth/auth.middleware";
import TransferController from "../controllers/transfer.controller";
import validate from "../helpers/validator";

const router = express.Router();

router.post(
  "/addaccount",
  verifyToken.verify,
  validate.validateBody(validate.schemas.bankDetailSchema),
  TransferController.addAccountToDB
);

// router.post(
//   "/paymenttransfer",
//   verifyToken.verify,
//   validate.validateBody(validate.schemas.transferSchema),
//   WalletController.transferToWallet
// );

export default router;
