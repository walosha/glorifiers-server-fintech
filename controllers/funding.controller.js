/**
 * /* eslint-disable indent
 *
 * @format
 */
var crypto = require("crypto");
import { handleErrorResponse, handleSuccessResponse } from "../helpers/utils";
import fundingService from "../services/funding.service";
import { recordCompletedPayment } from "../services/payment.service";
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
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_API_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (hash == req.headers["x-paystack-signature"]) {
      const { event, data } = req.body;

      // Retrieve the request's body

      if (event == "charge.success") {
        const {
          amount,
          reference,
          transfer_code,
          recipient: {
            email,
            name,
            recipient_code,
            created_at,
            updated_at,
            details: { account_number, account_name, bank_code, bank_name },
          },
        } = data;

        recordCompletedPayment(
          amount,
          reference,
          transfer_code,
          email,
          name,
          recipient_code,
          created_at,
          updated_at,
          account_number,
          account_name
        );
      }

      if (event == "charge.success") {
        const {
          amount,
          reference,
          customer: { email },
        } = data;

        fundingService(amount, reference, email);
      }
    }
    res.sendStatus(200);
  }
}

export default FundingController;
