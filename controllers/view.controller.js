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

  static async resetPassword(req, res, next) {
    // 1) Get tour data from collection
    const { token } = req.params;
    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render("reset-password", {
      token,
      message: "hellow",
    });
  }
}
export default ViewController;
