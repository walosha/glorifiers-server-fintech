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
    customerId: account.id,
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

export async function validateResetToken({ token }) {
  const account = await User.findOne({
    where: {
      resetToken: token,
      resetTokenExpires: { [Op.gt]: Date.now() },
    },
  });

  if (!account) throw "Invalid token";

  return account;
}

export async function getRefreshToken(token) {
  const refreshToken = await RefreshToken.findOne({ where: { token } });
  if (!refreshToken || !refreshToken.isActive) throw "Invalid token";
  return refreshToken;
}

export async function revokeToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);

  // revoke token and save
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
}

export async function refreshToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);
  const account = await refreshToken.getAccount();

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(account, ipAddress);
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(account);

  // return basic details and tokens
  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
}

// helper functions

async function getAccount(id) {
  const account = await User.findByPk(id);
  if (!account) throw "User not found";
  return account;
}
