import { User } from "../models";

export const verifyEmail = async function (token) {
  const account = await User.findOne({
    where: { verificationToken: token },
  });

  if (!account)
    return Promise.reject(
      new Error({
        message: "Email Verification failed",
        status: 404,
      })
    );

  account.verified = Date.now();
  account.isVerified = true;
  await account.save();
};
