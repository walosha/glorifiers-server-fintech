import { User, Wallet } from "../models";
const { v4: uuidv4 } = require("uuid");
import { handleErrorResponse, handleSuccessResponse } from "../helpers/utils";

import { verifyEmail } from "../services/user.service";

/**
 * @description User Controller
 * @class UserController
 */
class ViewController {
  /**
   * @description Verify Mail method
   * @static
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {string} verification successful, you can now login
   * @member UserController
   */

  static async verifyEmail(req, res, next) {
    try {
      await verifyEmail(req.params.verificationToken);
      return handleSuccessResponse(
        res,
        "Email Verification successful, you can now login",
        200
      );
    } catch (error) {
      console.log(error);
      return handleErrorResponse(res, error, 404);
    }
  }
}

export default ViewController;
