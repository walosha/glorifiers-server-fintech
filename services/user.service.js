import { User, RefreshToken } from "../models";
import {
  generateToken,
  handleErrorResponse,
  handleSuccessResponse,
  pickModelAttibutes,
  comparePassword,
  pickUser,
  basicDetails,
  randomTokenString,
} from "../helpers/utils";

async function generateRefreshToken(account, ipAddress) {
  // create a refresh token that expires in 7 days
  return await RefreshToken.create({
    accountId: account.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress,
  });
}

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

export const authenticate = async function (
  { email, password, ipAddress },
  res
) {
  const account = await User.scope("withHash").findOne({
    where: { email },
  });

  if (!account || !(await comparePassword(password, account.password))) {
    return handleErrorResponse(res, "User name or password is incorrect", 401);
  } else if (!account.isVerified) {
    return handleErrorResponse(
      res,
      "Check your mail to verify your account!",
      401
    );
  }

  // authentication successful so generate jwt and refresh tokens
  const token = generateToken({
    id: account.id,
    email: account.email,
    isAdmin: account.isAdmin,
  });

  const refreshToken = await generateRefreshToken(account, ipAddress);
  console.log({ refreshToken });

  // save refresh token
  refreshToken.save();

  // return basic details and tokens
  return {
    ...basicDetails(account),
    token,
    refreshToken: refreshToken.token,
  };
};
