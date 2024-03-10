const createHttpError = require('http-errors');
const { objectId, jwtTokenVerify } = require('../utils/common.util');
const {
  checkSession,
} = require('../repositories/accountSettingRepositories/user.repository');
const {
  SESSION_EXPIRED,
  TOKEN_REQUIRED,
  TOKEN_INVALID,
} = require('../messages/en');
/**
 * Check user authorization
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const authValidateRequest = async (req, res, next) => {
  const error = createHttpError.Unauthorized(SESSION_EXPIRED);
  try {
    if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        const scheme = parts[0];
        const token = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          const decodedToken = jwtTokenVerify(token);
          let userId = objectId(decodedToken?.userId);

          req.loginUser = {
            ...decodedToken,
            userId,
          };
          const userResult = await checkSession({ userId, token });
          decodedToken && userResult ? next() : next(error);
        } else {
          return next(error);
        }
      } else {
        return next(createHttpError.Unauthorized(TOKEN_INVALID));
      }
    } else {
      return next(createHttpError.Unauthorized(TOKEN_REQUIRED));
    }
  } catch (e) {
    return next(error);
  }
};
module.exports = authValidateRequest;
