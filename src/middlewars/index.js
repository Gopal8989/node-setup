const validateMiddleware = require('./validate.middleware');
const authMiddleware = require('./auth.middleware');
const userMiddleware = require('./user.middleware');
const resourceAccessMiddleware = require('./resourceAccess.middleware');
const multerMiddleware = require('./multer.middleware');

module.exports = {
  validateMiddleware,
  authMiddleware,
  resourceAccessMiddleware,
  userMiddleware,
  multerMiddleware,
};
