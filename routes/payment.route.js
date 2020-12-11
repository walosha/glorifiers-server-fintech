import express from "express";
import PaymentController from "../controllers/payment.controller";
import { verifyToken } from "../middlewares/auth/auth.middleware";
import validate from "../helpers/validator";

const router = express.Router();

router.post(
  "/payments",
  verifyToken.verify,
  validate.validateBody(validate.schemas.paymentSchema),
  PaymentController.createRef
);

export default router;
