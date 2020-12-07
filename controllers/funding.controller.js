/**
 * /* eslint-disable indent
 *
 * @format
 */
var crypto = require("crypto");
import { handleErrorResponse, handleSuccessResponse } from "../helpers/utils";
import fundingService from "../services/funding.service";
/**
 * @description Funding Controller
 * @class FundingController
 */
class FundingController {
  /**
   * @description Fund Account method
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} Funding
   * @member FundingController
   */

  static async funding(req, res) {
    console.log("enter the route");
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_API_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (hash == req.headers["x-paystack-signature"]) {
      // Retrieve the request's body
      const {
        event,
        data: {
          amount,
          reference,
          customer: { email },
        },
      } = req.body;

      if (event == "charge.success") {
        fundingService(amount, reference, email);
      }
    }
    res.sendStatus(200);
  }
}

export default FundingController;
