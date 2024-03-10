const mongoose = require('mongoose');
const { roleType, userStatus, labelName } = require('../utils/constant.util');

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    countryCode: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: false,
    },
    password: {
      type: String,
      trim: true,
    },

    userType: {
      type: String,
      trim: true,
      required: true,
      enum: roleType['ALL'],
      default: roleType['CUSTOMER'],
    },
    status: {
      type: String,
      trim: true,
      required: true,
      enum: userStatus['ALL'],
      default: userStatus['PENDING'],
    },
    resetToken: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;
