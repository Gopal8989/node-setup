const userRepository = require('../../repositories/accountSettingRepositories/user.repository');
const {
  badRequestError,
  paginationResponse,
} = require('../../utils/common.util');
const { userStatus } = require('../../utils/constant.util');
const errorMsg = 'SOMETHING_WENT_WRONG';

module.exports.userLogin = async (req, res, next) => {
  try {
    req.body.ipAddress = req?.ip;
    const result = await userRepository.userLogin(req?.body);

    if (result && result?.status === userStatus['ACTIVE']) {
      return next({ data: result, message: 'LOGIN' });
    }
    return next(badRequestError('INVALID_DETAILS'));
  } catch (error) {
    next(error);
  }
};

module.exports.userLogout = async (req, res, next) => {
  try {
    const result = await userRepository.userLogout(req?.loginUser);
    if (result) {
      return next({ data: result, message: 'lOGOUT' });
    }
    return next(badRequestError(errorMsg));
  } catch (error) {
    next(error);
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const { body } = req;
    await userRepository.forgotPassword(body);
    next({ data: {}, message: 'RESET_LINK_SENT' });
  } catch (error) {
    next(error);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const {
      body,
      user: { _id },
    } = req;
    await userRepository.resetPassword({ ...body, userId: _id });
    next({ data: {}, message: 'PASSWORD_UPDATE' });
  } catch (error) {
    next(error);
  }
};

module.exports.changePassword = async (req, res, next) => {
  try {
    const {
      body,
      loginUser: { userId },
    } = req;
    await userRepository.resetPassword({ ...body, userId });
    next({ data: {}, message: 'PASSWORD_UPDATE' });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserDetail = async (req, res, next) => {
  try {
    const {
      params: { id: userId },
      loginUser,
    } = req;
    const result = await userRepository.getUserDetail({
      userId: loginUser?.userId ?? userId,
    });
    return result
      ? next({ data: result, message: '' })
      : next(badRequestError('USER_NOT_FOUND'));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const result = await userRepository.updateUser(req);
    return result
      ? next({
          data: result,
          message: 'PROFILE_UPDATED',
        })
      : next(badRequestError('USER_NOT_FOUND'));
  } catch (error) {
    next(error);
  }
};
