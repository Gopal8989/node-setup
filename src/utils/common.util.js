const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');
const { logo } = require('./constant.util');
const message = require('../messages/en');
const {
  app: { secretKey, jwtExpiresIn, baseUrl },
} = require('../config/index');

module.exports.otpGenerate = () => {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
  } catch (error) {
    throw Error(error);
  }
};

module.exports.generateRandomString = (length = 10) => {
  try {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' +
      Date.now();
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  } catch (error) {
    throw Error(error);
  }
};

module.exports.convertHtmlToEjs = (ejsObject) => {
  try {
    const { fileName, data } = ejsObject;
    data.logo = logo?.image;
    return new Promise((resolve, reject) => {
      ejs
        .renderFile(path.join(__dirname, `../ejs/${fileName}.ejs`), { data })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (error) {
    throw Error(err);
  }
};

module.exports.objectId = (id) => {
  try {
    return mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : Error('Object id invalid');
  } catch (error) {
    throw Error(error);
  }
};

module.exports.passwordEncryption = async (password) => {
  try {
    const salt = await bcrypt.genSalt(); // password encrypt
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw Error(err);
  }
};

module.exports.validatePasswordEncryption = async (password, newPassword) => {
  try {
    return await bcrypt.compare(password, newPassword);
  } catch (error) {
    throw Error(err);
  }
};

module.exports.jwtTokenCreate = (payload) => {
  try {
    return jwt.sign(payload, secretKey, {
      expiresIn: jwtExpiresIn,
    });
  } catch (error) {
    throw Error(err);
  }
};

module.exports.jwtTokenVerify = (token) => {
  try {
    return jwt.verify(token, secretKey, {
      expiresIn: jwtExpiresIn,
    });
  } catch (error) {
    throw Error(err);
  }
};

module.exports.badRequestError = (key, status) =>
  createHttpError[status ?? 'BadRequest'](message[key] ?? key);

module.exports.firstLetterUpperCaseConvertor = (msg) =>
  msg ? msg.charAt(0).toUpperCase() + msg.slice(1) : null;

module.exports.mediaUnlink = async (filePath) => {
  try {
    const filePathArray = Array.isArray(filePath) ? filePath : [filePath];
    const paths = filePathArray.map(async (e) => {
      try {
        const pathDir = path.join(__dirname + `../../../${e}`);
        fs.existsSync(pathDir) && fs.unlinkSync(pathDir);
        return true;
      } catch (error) {
        throw Error(error);
      }
    });
    return await Promise.allSettled(paths);
  } catch (error) {
    throw Error(err);
  }
};

module.exports.getMediaPath = (filePath) => {
  try {
    const pathDir = path.join(__dirname + `../../../${filePath}`);
    if (fs.existsSync(pathDir)) {
      return `${filePath}`;
    }
    return null;
  } catch (error) {
    throw Error(err);
  }
};

module.exports.paginationResponse = (result, limit = 10) => {
  try {
    const data = { count: 0, totalPages: 0, ...result[0] };
    if (limit) {
      const pages = data?.count / parseInt(limit || 10);
      data.totalPages = parseInt(pages) > 0 ? Math.ceil(pages ?? 0) : 1;
    }
    return data;
  } catch (error) {
    throw Error(err);
  }
};
