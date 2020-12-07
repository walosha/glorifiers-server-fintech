import { Funding, Wallet, User, Transaction } from "../models";

/**
 * @description Generate random numbers
 * @returns {Number} numbers
 */
export const generateNumber = () => {
  let str = "";
  const characters = "123456789";
  for (let i = 0; i < 8; i += 1) {
    str += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return Number(str);
};

const fundingService = async (amount, reference, email) => {
  let accountNumber;
  try {
    //convert kobo to naira
    amount /= 100;
    const user = await User.findOne({
      where: { email },
    });

    const funding = await Funding.create({
      customerId: user.id,
      amount,
      reference,
    });

    const userWallet = await Wallet.findOne({
      where: {
        customerId: user.id,
      },
    });

    if (userWallet) {
      userWallet.balance += amount;
      userWallet.save();
    }

    if (userWallet === null) {
      accountNumber = generateNumber();

      await Wallet.create({
        customerId: user.id,
        accountNumber,
        balance: amount,
      });
    }

    const transaction = new Transaction();

    transaction.amount = amount;
    transaction.accountNumber = accountNumber || userWallet.accountNumber;
    transaction.narration = `funded account wallet: ${
      accountNumber || userWallet.accountNumber
    } with =N=${amount}`;
    transaction.type = "funding";
    await transaction.save();
    return funding;
  } catch (error) {
    // console.log({ error });
    return Promise.reject(error);
  }
};

export default fundingService;
