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
  amount
) {
  try {
    const {
      data: { data },
    } = await Paystack.post("/transferrecipient", {
      type,
      name,
      account_number,
      bank_code,
    });

    const response = await Paystack.post("/transfer", {
      source: "balance",
      amount: amount,
      recipient: data.recipient_code,
    });

    return response.data.data;
  } catch (error) {
    return error.response;
  }
}

export async function recordCompletedPayment(
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
) {
  try {
    await Payment.create({
      amount,
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

    const userWallet = await Wallet.findOne({
      where: {
        email,
      },
    });

    const transaction = new Transaction();

    transaction.amount = amount;
    transaction.accountNumber = account_number;
    transaction.narration =
      description ||
      `Withdrew from  ${userWallet.accountNumber} with =N=${amount}`;
    transaction.type = "debit";
    await transaction.save();
    const charges = new Transaction();

    charges.amount = process.env.WITHDRAWAL_CHARGES * 1 || 100;
    charges.accountNumber = account_number;
    charges.narration =
      description ||
      `Charges on Withdrawl of ${amount} from  ${userWallet.accountNumber}`;
    charges.type = "charges";
    await charges.save();
  } catch (error) {
    console.log({ error });
  }
}
