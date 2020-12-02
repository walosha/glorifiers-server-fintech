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
  static async last3Transaction(req, res) {
    try {
      const { id } = req;
      const wallet = await Wallet.findOne({
        where: {
          customerId: id,
        },
      });

      if (wallet === null) return handleSuccessResponse(res, wallet, 200);
      const last3Transactios = await Transaction.findAll({
        where: {
          accountNumber: wallet.accountNumber,
        },
        limit: 3,
        order: [["updatedAt", "DESC"]],
      });

      return handleSuccessResponse(res, last3Transactios, 200);
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
