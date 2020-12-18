/**
 * /* eslint-disable indent
 *
 * @format
 */
import { User, Wallet } from "../models";
const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
import {
  generateToken,
  handleErrorResponse,
  handleSuccessResponse,
  pickModelAttibutes,
  hash,
  pickUser,
  randomTokenString,
} from "../helpers/utils";
import {
  authenticate,
  refreshToken,
  validateResetToken,
  revokeToken,
} from "../services/user.service";
import Email from "../services/sendgrid.services";

const S3 = new aws.S3({
  accessKeyId: process.env.AMAZON_ACCESS_KEY,
  secretAccessKey: process.env.AMAZON_SECRET_KEY,
});

function setTokenCookie(res, token) {
  // create cookie with refresh token that expires in 7 days
  const cookieOptions = {
    maxAge: 60 * 60 * 1000, // 1 hour
    httpOnly: true,
    secure: true,
    sameSite: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  res.cookie("refreshToken", token, cookieOptions);
}

/**
 * @description User Controller
 * @class UserController
 */
class UserController {
  /**
   * @description Sign up method
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} User
   * @member UserController
   */
  static async createUser(req, res) {
    let newUser;
    const body = pickModelAttibutes(User, req.body);
    try {
      const user = await User.create({
        ...body,
      });
      user.verificationToken = randomTokenString();
      user.save();

      const resetURL = `${process.env.DOMAIN_URL}/verify-email/${user.verificationToken}`;
      // send email
      await new Email(user, resetURL).sendVerifyEmail();
      newUser = pickUser(user.dataValues);
    } catch (e) {
      console.log({ e });
      if (e.original.code === "23505") {
        return handleErrorResponse(res, e.original.detail, 409);
      }
      return handleErrorResponse(res, e, 500);
    }
    return handleSuccessResponse(res, newUser, 201);
  }

  static async getSignedUrl(req, res, next) {
    const Key = `${req.id}/${uuidv4()}.jpg`;
    // Client should use "PUT" request
    S3.getSignedUrl(
      "putObject",
      {
        Bucket: "glorifiers",
        ContentType: "image/jpeg",
        Key,
      },
      (err, url) => res.send({ Key, url })
    );
  }

  static async uploadProfileImg(req, res, next) {
    try {
      const { id } = req;
      const isUser = await User.findOne({
        where: {
          id,
        },
      });

      if (!isUser) {
        return handleErrorResponse(res, "This user does not Exist", 404);
      }

      const updatedUser = await isUser.update({ image: req.body.image });

      updatedUser.password = undefined;

      return handleSuccessResponse(res, updatedUser, 201);
    } catch (error) {
      return handleErrorResponse(res, "upload failed", 404);
    }
  }

  static async verifyAccountNo(req, res, next) {
    try {
      const { accountNumber } = req.params;
      const wallet = await Wallet.findOne({ where: { accountNumber } });
      if (!wallet) {
        return handleErrorResponse(res, "Account Number does not Exist", 404);
      }
      const { firstName, lastName } = await User.findOne({
        where: { id: wallet.customerId },
      });

      return handleSuccessResponse(res, { firstName, lastName }, 201);
    } catch (error) {
      console.log({ error });
      return handleErrorResponse(res, "Try again later", 404);
    }
  }

  /**
   * @description Login method
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} User
   * @member UserController
   */

  static async signIn(req, res) {
    try {
      const { email, password } = req.body;

      const ipAddress = req.ip;

      const { refreshToken, token, ...account } = await authenticate(
        {
          email,
          password,
          ipAddress,
        },
        res
      );

      setTokenCookie(res, refreshToken);

      return res.status(200).json({
        status: "success",
        data: {
          ...account,
        },
        refreshToken,
        token,
      });
    } catch (error) {
      console.log({ error });
      return handleErrorResponse(res, error.message, 500);
    }
  }

  static async forgotPassword(req, res, next) {
    const { email } = req.body;
    const account = await User.findOne({ where: { email } });

    // always return ok response to prevent email enumeration
    if (!account)
      return handleSuccessResponse(
        res,
        "A reset password has been sent to your mail!",
        200
      );

    // create reset token that expires after 24 hours
    account.resetToken = randomTokenString();
    account.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await account.save();
    // send email
    const forgetpasswordtURL = `${process.env.DOMAIN_URL}/reset-password/${account.resetToken}`;
    // send email
    await new Email(account, forgetpasswordtURL).sendPasswordReset();

    return handleSuccessResponse(
      res,
      "A reset password has been sent to your mail!",
      200
    );
  }

  static async resetPassword(req, res, next) {
    const { password } = req.body;
    const { token } = req.params;
    try {
      const account = await validateResetToken(token, res);
      if (!account) return handleErrorResponse(res, "Invalid token", 401);
      // update password and remove reset token
      account.passwordHash = await hash(password);
      account.passwordReset = Date.now();
      account.resetToken = null;
      await account.save();
      return handleSuccessResponse(
        res,
        "Your password has sucessfully been changed!",
        201
      );
    } catch (e) {
      console.log({ e });
    }
  }

  static refreshToken(req, res, next) {
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    refreshToken({ token, ipAddress })
      .then(({ refreshToken, ...account }) => {
        setTokenCookie(res, refreshToken);
        res.json(account);
      })
      .catch(next);
  }

  static revokeToken(req, res, next) {
    // accept token from request body or cookie
    const token = req.body.token || req.cookies.refreshToken;
    const ipAddress = req.ip;

    if (!token) return res.status(400).json({ message: "Token is required" });

    // users can revoke their own tokens and admins can revoke any tokens
    if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    revokeToken({ token, ipAddress })
      .then(() => res.json({ message: "Token revoked" }))
      .catch(next);
  }

  static validateResetToken(req, res, next) {
    validateResetToken(req.params)
      .then(() =>
        res.json({
          status: "Success",
          data: "Token is valid",
        })
      )
      .catch(next);
  }
}

export default UserController;
