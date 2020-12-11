/**
 * /* eslint-disable indent
 *
 * @format
 */

import { Wallet, BankDetail } from "../models";
import { handleErrorResponse, handleSuccessResponse } from "../helpers/utils";
import { createRecipeintCode } from "../services/payment.service";
/**
 * @description wallet Controller
 * @class TransctionController
 */
class PaymentController {
  /**
   * @description Transfer
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {object} transfer
   * @member PaymentController
   */
  static async createRef(req, res) {
    const { id, amount } = req;

    const userWallet = await Wallet.findOne({ where: { customerId: id } });

    if (!userWallet) {
      return handleSuccessResponse(
        res,
        "Kindly fund your account and create a wallet to make withdrawal",
        401
      );
    }

    if (userWallet.balance < amount) {
      return handleSuccessResponse(
        res,
        "Unsufficient Balance. Please fund your wallet",
        401
      );
    }

    const userBankDetail = BankDetail.findOne({ where: { customerId: id } });

    if (!userBankDetail) {
      return handleSuccessResponse(
        res,
        "Kindly add your bak details to the app",
        200
      );
    }

    const { type, name, account_number, bank_code } = userBankDetail;

    try {
      const customerRef = await createRecipeintCode(
        type,
        name,
        account_number,
        bank_code,
        amount
      );
      return handleSuccessResponse(res, customerRef, 200);
    } catch (error) {
      console.log({ error });
      return handleErrorResponse(res, error, 500);
    }
  }
}

export default PaymentController;
