const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema(
  {
    token: {
      type: String,
      trim: true,
      required: true,
    },
    ip: {
      type: String,
      trim: true,
    },
    userId: {
      type: String,
      trim: true,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const sessionModel = mongoose.model('sessions', sessionSchema);
module.exports = sessionModel;
