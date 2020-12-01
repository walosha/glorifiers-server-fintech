import express from "express";
import {
  verifyToken,
  validateAdmin,
} from "../middlewares/auth/auth.middleware";
import TransactionController from "../controllers/transaction.controller";

const router = express.Router();

router.get(
  "/transactions/:transactionId",
  verifyToken.verify,
  validateAdmin,
  TransactionController.getTransaction
);

router.get(
  "/transactions/:accountNumber",
  verifyToken.verify,
  validateAdmin,
  TransactionController.getAllTransaction
);

export default router;
