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

  static alerts(req, res, next) {
    const { alert } = req.query;
    if (alert === "booking") res.locals.alert = "This is an alert.";
    next();
  }

  static async verifyEmail(req, res, next) {
    try {
      const email = await verifyEmail(req.params.verificationToken, res);
      return handleSuccessResponse(
        res,
        `${email} was successful Verified, please login`,
        200
      );
    } catch (error) {
      console.log({ error: error.message });
      return handleErrorResponse(res, error, 404);
    }
  }
}
export default ViewController;
