import { Transaction, Wallet } from "../models";
import appError from "../helpers/appError";

const transferService = async (amount, accountNumber, customerId, next) => {
  try {
    const wallet = await Wallet.findOne({
      where: {
        customerId,
      },
    });

    const receivingWallet = await Wallet.findOne({
      where: {
        accountNumber,
      },
    });

    if (receivingWallet === null) {
      return next(new appError("Account number does not exist", 404));
    }

    if (wallet.balance > amount) {
      wallet.balance -= amount;
      receivingWallet.balance += amount;

      await wallet.save();
      await receivingWallet.save();

      const transaction = new Transaction();
      transaction.amount = -amount;
      transaction.accountNumber = wallet.accountNumber;
      transaction.narration = `transfer_to_account: ${accountNumber}`;
      transaction.type = "transfer";
      await transaction.save();

      const transactionRecipient = new Transaction();
      transactionRecipient.amount = amount;
      transactionRecipient.accountNumber = accountNumber;
      transactionRecipient.narration = `transfer_from_account: ${wallet.accountNumber}`;
      transactionRecipient.type = "transfer";
      await transactionRecipient.save();
      return {
        transaction,
        wallet,
      };
    }

    return Promise.reject(
      next(new appError("Insufficient funds in wallet", 404))
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export default transferService;
