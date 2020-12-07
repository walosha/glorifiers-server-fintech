import express from "express";
import FundingController from "../controllers/funding.controller";

const router = express.Router();

router.post("/webhook/funding", FundingController.funding);

export default router;
