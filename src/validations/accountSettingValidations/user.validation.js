const Joi = require('joi');
const { ONLY_DIGIT_REQUIRED } = require('../../messages/en');
const { digit, strongPassword } = require('../../utils/regex.util');

const digitMessage = {
  'string.pattern.base': ONLY_DIGIT_REQUIRED,
};

const userCreate = {
  email: Joi.string().trim().email().max(100).required(),
  name: Joi.string().trim().label('Full name').max(50).required(),
  latitude: Joi.string().trim().optional().empty().allow('', null),
  longitude: Joi.string().trim().optional().empty().allow('', null),
  phoneNumber: Joi.string()
    .trim()
    .label('Phone number')
    .regex(digit)
    .messages(digitMessage)
    .length(10)
    .required(),
  countryCode: Joi.string().label('Country code').max(5).required(),
};

const passwordObj = {
  password: Joi.string()
    .trim()
    .min(8)
    .max(25)
    .regex(strongPassword)
    .messages({
      'string.pattern.base': '"Password must be strong',
    })
    .required(),
  confirmPassword: Joi.string()
    .label('Confirm password')
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'CONFIRM_PASSWORD_MUST_BE_SAME',
    }),
};
const loginSchema = Joi.object().keys({
  email: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
});

const signupSchema = Joi.object().keys({
  ...userCreate,
  ...passwordObj,
  userId: Joi.string().trim().optional().empty().allow('', null),
});

const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string().trim().email().required(),
});

const resetPasswordSchema = Joi.object().keys({
  token: Joi.string().trim().required(),
  ...passwordObj,
});

const changePasswordSchema = Joi.object().keys({
  ...passwordObj,
  oldPassword: Joi.string()
    .label('Old password')
    .disallow(Joi.ref('password'))
    .messages({
      'any.invalid': 'NEW_OLD_PASSWORD_NOT_BE_SAME',
    })
    .required(),
});

const updateUserSchema = Joi.object().keys(userCreate);

const updateUserProfileSchema = Joi.object().keys({
  email: Joi.string().trim().email().max(100).required(),
  name: Joi.string().trim().max(100).required(),
  phoneNumber: Joi.string()
    .trim()
    .label('Phone number')
    .regex(digit)
    .messages(digitMessage)
    .length(10)
    .required(),
  countryCode: Joi.string().label('Country code').max(5).required(),
});

module.exports = {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateUserSchema,
  updateUserProfileSchema,
};
