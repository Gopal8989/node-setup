const createHttpError = require('http-errors');
const { PERMISSION_DENIED } = require('../messages/en');

/**
 * If type = true then permission granted otherwise not granted (false) for that role
 */
module.exports = checkRolePermission =
  (roles, type = true) =>
  async (req, res, next) => {
    try {
      let {
        loginUser: { userType },
      } = req;
      roles.includes(userType) === type
        ? next()
        : next(createHttpError.Forbidden(PERMISSION_DENIED));
    } catch (error) {
      next(error);
    }
  };
