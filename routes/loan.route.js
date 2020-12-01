import express from "express";
import LoanController from "../controllers/loan.Controller";
import { verifyToken } from "../middlewares/auth/auth.middleware";
import validate from "../helpers/validator";

const router = express.Router();

router

  .post(
    "/loan-application",
    verifyToken.verify,
    validate.validateBody(validate.schemas.loanSchema),
    LoanController.loanApplication
  )
  .get("/loan-status", verifyToken.verify, LoanController.loanApplication);

export default router;
