const { Router } = require('express');
const userController = require('../../controllers/accountSettingController/user.controller.js');
const middleware = require('../../middlewars/index.js');
const {
  validateMiddleware,
  userMiddleware,
  authMiddleware,
  resourceAccessMiddleware,
} = middleware;
const userValidator = require('../../validations/accountSettingValidations/user.validation.js');

const router = Router();

router.post(
  '/login',
  validateMiddleware(userValidator.loginSchema),
  userController.userLogin
);

router.post('/logout', authMiddleware, userController.userLogout);

router.post(
  '/forgot-password',
  validateMiddleware(userValidator.forgotPasswordSchema),
  userMiddleware.checkUserExist,
  userController.forgotPassword
);

router.post(
  '/reset-password',
  validateMiddleware(userValidator.resetPasswordSchema),
  userMiddleware.checkTokenExist,
  userController.resetPassword
);

router.post(
  '/change-password',
  authMiddleware,
  validateMiddleware(userValidator.changePasswordSchema),
  userMiddleware.checkOldPasswordExist,
  userController.changePassword
);

router.get('/user-profile', authMiddleware, userController.getUserDetail);

router.put(
  '/user-profile',
  authMiddleware,
  validateMiddleware(userValidator.updateUserProfileSchema),
  userMiddleware.checkUpdateEmailOrPhoneNumber,
  userController.updateUser
);
module.exports = router;
