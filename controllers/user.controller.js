/**
 * /* eslint-disable indent
 *
 * @format
 */

import { User } from "../models";
const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
import {
  generateToken,
  handleErrorResponse,
  handleSuccessResponse,
  pickModelAttibutes,
  comparePassword,
  pickUser,
} from "../helpers/utils";

const S3 = new aws.S3({
  accessKeyId: process.env.AMAZON_ACCESS_KEY,
  secretAccessKey: process.env.AMAZON_SECRET_KEY,
});

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
        ContentType: "image/png",
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

      // Check if email exists
      const isUser = await User.findOne({
        where: {
          email,
        },
      });

      if (!isUser) {
        const error = "This email does not exist";
        return handleErrorResponse(res, error, 404);
      }
      const isMatch = comparePassword(password, isUser.password);
      if (!isMatch) {
        return handleErrorResponse(res, "Wrong Password", 401);
      }
      const token = generateToken({
        id: isUser.id,
        email: isUser.email,
        isAdmin: isUser.isAdmin,
      });

      res.cookie("access_token", token, {
        maxAge: 60 * 60 * 1000, // 1 hour
        httpOnly: true,
        secure: true,
        sameSite: true,
      });

      return res.status(200).json({
        status: "success",
        message: `Welcome ${isUser.firstName}`,
        data: {
          userId: isUser.id,
          firstName: isUser.firstName,
          lastName: isUser.lastName,
          email: isUser.email,
          phoneNumber: isUser.phoneNumber,
          image: isUser.image,
        },
        token,
      });
    } catch (error) {
      return handleErrorResponse(res, error.message, 500);
    }
  }
}

export default UserController;
