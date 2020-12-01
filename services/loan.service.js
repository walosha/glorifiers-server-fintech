import { Wallet, Loan } from "../models";

const loanService = async (customerId, loan) => {
  try {
    const wallet = await Wallet.findOne({
      where: {
        customerId,
      },
    });

    if (wallet === null) {
      return Promise.reject(
        new Error({
          message: "You do not have a wallet and and no savings yet",
          status: 404,
        })
      );
    }

    if (wallet.balance * 2 < loan.amount) {
      return Promise.reject(
        new Error({
          message: "Insufficient fund to Access loan",
          status: 404,
        })
      );
    }

    const loanApplicationCreated = await Loan.create({ ...loan, customerId });

    return loanApplicationCreated;
  } catch (error) {
    return Promise.reject(error);
  }
};

export default loanService;
