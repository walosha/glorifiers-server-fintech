import axios from "axios";
import { Payment, Transaction, Wallet } from "../models";

const baseURL = "https://api.paystack.co";

export const Paystack = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export async function createRecipeintCode(
  type,
  name,
  account_number,
  bank_code,
  amount,
  email,
  id
) {
  try {
    const {
      data: { data },
    } = await Paystack.post("/transferrecipient", {
      type,
      name,
      account_number,
      bank_code,
      metadata: {
        email,
        id,
      },
    });

    const response = await Paystack.post("/transfer", {
      source: "balance",
      amount: amount * 100,
      recipient: data.recipient_code,
    });

    return response.data.data;
  } catch (error) {
    console.log(error.response.data);
    error.response.data.message;
  }
}

export async function recordCompletedPayment(
  amount,
  reference,
  transfer_code,
  email,
  id,
  name,
  recipient_code,
  created_at,
  updated_at,
  account_number,
  account_name
) {
  try {
    // Get user wallet detail
    const userWallet = await Wallet.findOne({
      where: {
        customerId: id,
      },
    });

    // Create withdrawal record

    await Payment.create({
      amount,
      customerId: id,
      reference,
      transfer_code,
      email,
      name,
      recipient_code,
      createdAt: created_at,
      updatedAt: updated_at,
      account_number,
      account_name,
    });

    //convert kobo to naira
    amount /= 100;

    //update transaction with amount on withdrawal

    const transaction = new Transaction();
    transaction.amount = amount;
    transaction.accountNumber = userWallet.accountNumber;
    transaction.narration = `Transfer from wallet a/c ${userWallet.accountNumber} to bank a/c ${account_number}`;
    transaction.type = "debit";
    await transaction.save();

    //update transaction with charges on withdrawal

    const charges = new Transaction();
    charges.amount = process.env.WITHDRAWAL_CHARGES * 1 || 100;
    charges.accountNumber = userWallet.accountNumber;
    charges.narration = `Charge on Withdrawl of ${amount} from wallet  ${userWallet.accountNumber}`;
    charges.type = "charges";
    await charges.save();

    //update user wallet balance
    userWallet.balance -= amount + (process.env.WITHDRAWAL_CHARGES * 1 || 100);
    userWallet.save();
  } catch (error) {
    console.log({ error });
  }
}
