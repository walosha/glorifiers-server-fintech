import express from "express";
import UserController from "../controllers/user.controller";
import validate from "../helpers/validator";
import { verifyToken } from "../middlewares/auth/auth.middleware";
import { authorize } from "../helpers/authorize";
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

router.post("/refresh-token", UserController.refreshToken);

router.post(
  "/revoke-token",
  authorize(),
  validate.validateBody(validate.schemas.revokeTokenSchema),
  UserController.revokeToken
);
router.post(
  "/validate-reset-token",
  validate.validateBody(validate.schemas.validateResetTokenSchema),
  UserController.validateResetToken
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
