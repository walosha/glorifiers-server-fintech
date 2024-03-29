import express from "express";
import { verifyToken } from "../middlewares/auth/auth.middleware";
import WalletController from "../controllers/wallet.controller";
import validate from "../helpers/validator";

const router = express.Router();

router.post(
  "/wallets/transfer",
  verifyToken.verify,
  validate.validateBody(validate.schemas.transferSchema),
  WalletController.transferToWallet
);

router.get("/wallets", verifyToken.verify, WalletController.getWallet);

router.get(
  "/transactions/:accountNumber",
  verifyToken.verify,
  WalletController.getWalletTransactions
);

export default router;
