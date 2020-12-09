import express from "express";
import UserController from "../controllers/user.controller";
import validate from "../helpers/validator";
import { verifyToken } from "../middlewares/auth/auth.middleware";
const router = express.Router();

router.post(
  "/auth/create-user",
  validate.validateBody(validate.schemas.authSchema),
  UserController.createUser
);

router.post(
  "/auth/signin",
  validate.validateBody(validate.schemas.authLoginSchema),
  UserController.signIn
);

router.post("/forgot-password", UserController.forgotPassword);
router.post("/reset-password/:token", UserController.resetPassword);

router.get("/getSignedUrl", verifyToken.verify, UserController.getSignedUrl);

router.patch(
  "/uploadProfileImg",
  verifyToken.verify,
  UserController.uploadProfileImg
);

router.get(
  "/verifyAccountNo/:accountNumber",
  verifyToken.verify,
  UserController.verifyAccountNo
);

export default router;
