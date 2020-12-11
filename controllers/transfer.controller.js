import { handleErrorResponse, handleSuccessResponse } from "../helpers/utils";
import fundingService from "../services/funding.service";
import { BankDetail } from "../models";
/**
 * @description Funding Controller
 * @class FundingController
 */
class TransferController {
  /**
   * @description Fund Account method
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} Funding
   * @member FundingController
   */

  static async addAccountToDB(req, res) {
    const { account_number, bank_code, type, bvn } = req.body;

    try {
      const bankdetail = BankDetail.create({
        account_number,
        customerId: req.id,
        bank_code,
        type,
        bvn,
      });
      handleSuccessResponse(res, bankdetail, 201);
    } catch (error) {
      console.log({ error });
      handleErrorResponse(res, error, 500);
    }
  }
}

export default TransferController;
