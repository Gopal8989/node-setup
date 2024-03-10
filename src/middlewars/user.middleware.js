const userRepository = require('../repositories/accountSettingRepositories/user.repository');
const { validatePasswordEncryption } = require('../utils/common.util');
const { badRequestError } = require('../utils/common.util');

module.exports.checkEmailOrPhoneNumber = async (req, res, next) => {
  try {
    const { body } = req;
    const emailResult = await userRepository.checkEmailOrPhoneNumber(body);
    if (emailResult && (emailResult?.isOtpVerify || emailResult?.parentId)) {
      const msg =
        emailResult?.email.toLowerCase() === body?.email.toLowerCase()
          ? 'EMAIL_EXIST'
          : 'PHONE_NUMBER_EXIST';
      return next(badRequestError(msg));
    }
    req.body.isOtpVerify = !!body?.userId;
    req.body.userId = body?.userId || emailResult?._id;
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports.checkUpdateEmailOrPhoneNumber = async (req, res, next) => {
  try {
    const {
      body,
      params: { id },
      loginUser: { userId },
    } = req;
    body.id = id ?? userId;
    const emailResult = await userRepository.checkEmailOrPhoneNumber(body);
    if (emailResult) {
      const msg =
        emailResult?.email.toLowerCase() === body?.email.toLowerCase()
          ? 'EMAIL_EXIST'
          : 'PHONE_NUMBER_EXIST';
      return next(badRequestError(msg));
    }
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports.checkUserExist = async (req, res, next) => {
  try {
    const { body } = req;
    const emailResult = await userRepository.checkUserExist(body);
    if (emailResult) {
      req.user = emailResult;
      return next();
    }
    return next(badRequestError('USER_NOT_FOUND'));
  } catch (error) {
    next(error);
  }
};

module.exports.checkTokenExist = async (req, res, next) => {
  try {
    const { body } = req;
    const result = await userRepository.checkUserExist(body);
    if (result) {
      req.user = result;
      return next();
    }
    return next(badRequestError('LINK_EXPIRED'));
  } catch (error) {
    next(error);
  }
};

module.exports.checkOldPasswordExist = async (req, res, next) => {
  try {
    const {
      body: { oldPassword },
      loginUser: { userId },
    } = req;
    const result = await userRepository.checkUserExist({ userId });
    const msg = 'OLD_PASSWORD_INVALID';
    if (result) {
      const isValidPassword = await validatePasswordEncryption(
        oldPassword,
        result?.password
      );
      return isValidPassword ? next() : next(badRequestError(msg));
    }
    return next(badRequestError(msg));
  } catch (error) {
    next(error);
  }
};

module.exports.checkMemberDuplicateEmail = async (req, res, next) => {
  try {
    const { body } = req;
    const result = await userRepository.checkUserExist(body);
    return result
      ? next(badRequestError('MEMBER_EMAIL_ALREADY_REGISTER'))
      : next();
  } catch (error) {
    next(error);
  }
};
