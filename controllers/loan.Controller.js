/**
 * /* eslint-disable indent
 *
 * @format
 */

import { handleErrorResponse, handleSuccessResponse } from "../helpers/utils";
import loanService from "../services/loan.service";
/**
 * @description Funding Controller
 * @class FundingController
 */
class LoanController {
  /**
   * @description Fund Account method
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} Loan
   * @member LoanController
   */
  static async loanApplication(req, res) {
    try {
      const { id } = req;
      const Loan = await loanService(id, req.body);
      return handleSuccessResponse(res, Loan, 201);
    } catch (error) {
      console.log({ LoanController: error });
      return handleErrorResponse(res, error, 500);
    }
  }
}

export default LoanController;
