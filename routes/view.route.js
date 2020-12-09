import express from "express";
import {
  verifyToken,
  validateAdmin,
} from "../middlewares/auth/auth.middleware";
import ViewController from "../controllers/view.controller";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("http://glorifiers.ng/");
});

router.get("/verify-email/:verificationToken", ViewController.verifyEmail);

export default router;
