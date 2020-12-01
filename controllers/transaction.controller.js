/**
 * /* eslint-disable indent
 *
 * @format
 */

import { Wallet, Transaction } from "../models";
import { handleErrorResponse, handleSuccessResponse } from "../helpers/utils";
/**
 * @description wallet Controller
 * @class TransctionController
 */
class TransctionController {
  /**
   * @description Transfer
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} transfer
   * @member TransctionController
   */
  static async getTransaction(req, res) {
    try {
      const { transactionId } = req.params;

      const transationDetail = await Transaction.findOne({
        where: { transactionId },
      });

      return handleSuccessResponse(res, transationDetail, 200);
    } catch (error) {
      return handleErrorResponse(res, error, 500);
    }
  }

  /**
   * @description View Wallet
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} wallet
   * @member TransctionController
   */
  static async getAllTransaction(req, res) {
    try {
      const { accountNumber } = req.params;
      const alltransactionsDetail = await Wallet.findOne({
        where: {
          accountNumber,
        },
      });
      return handleSuccessResponse(res, alltransactionsDetail, 200);
    } catch (error) {
      return handleErrorResponse(res, error, 500);
    }
  }
}

export default TransctionController;
