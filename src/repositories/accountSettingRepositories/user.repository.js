const sessionModel = require('../../models/session.model');
const userModel = require('../../models/user.model');
const {
  generateRandomString,
  convertHtmlToEjs,
  passwordEncryption,
  validatePasswordEncryption,
  jwtTokenCreate,
  objectId,
} = require('../../utils/common.util');
const { userStatus, logo } = require('../../utils/constant.util');
const {
  app: { frontendUrl },
} = require('../../config/index');
const { sendMail } = require('../../services/email.service');

module.exports.checkEmailOrPhoneNumber = async (body) => {
  try {
    const { email, phoneNumber } = body;
    let query = {
      status: { $ne: userStatus['DELETED'] },
    };
    if (email) {
      query.email = email;
    }
    if (phoneNumber) {
      query.phoneNumber = phoneNumber;
    }
    if (email && phoneNumber) {
      query = {
        $or: [{ email }, { phoneNumber }],
        status: { $ne: userStatus['DELETED'] },
      };
    }
    if (body?.id || body.userId) {
      query._id = { $ne: objectId(body?.id || body.userId) };
    }
    return await userModel.findOne(query);
  } catch (error) {
    throw Error(error);
  }
};

module.exports.checkUserExist = async (body) => {
  try {
    const { email, token, phoneNumber, userId } = body;
    let query = { status: { $ne: userStatus['DELETED'] } };
    if (email) {
      query.email = email;
    }
    if (token) {
      query.resetToken = token;
    }
    if (phoneNumber) {
      query.phoneNumber = phoneNumber;
    }

    if (userId) {
      query._id = userId;
    }
    return await userModel.findOne(query);
  } catch (error) {
    throw Error(error);
  }
};

module.exports.forgotPassword = async (body) => {
  try {
    const { email } = body;
    let query = { email };
    const resetToken = generateRandomString();
    const result = await userModel.findOneAndUpdate(query, {
      $set: { resetToken },
    });
    if (result) {
      const data = await convertHtmlToEjs({
        fileName: 'forgot-password',
        data: {
          email,
          logo: logo,
          resetLink: `${frontendUrl}/resetPassword/${resetToken}`,
        },
      });
      await sendMail({
        to: email,
        subject: 'FORGOT_PASSWORD_LINK_EMAIL',
        message: data,
      });
    }
    return result;
  } catch (error) {
    throw Error(error);
  }
};

module.exports.resetPassword = async (body) => {
  try {
    const { password, userId } = body;
    let query = { _id: userId };

    const saltPassword = await passwordEncryption(password);
    return await userModel.findOneAndUpdate(query, {
      $set: { resetToken: null, password: saltPassword },
    });
  } catch (error) {
    throw Error(error);
  }
};

module.exports.userLogin = async (body) => {
  try {
    const { email, password, ipAddress } = body;
    let query = {
      email,
      status: { $ne: userStatus['DELETED'] },
    };
    const userResult = await userModel.findOne(query);

    if (userResult) {
      if (userResult?.status === userStatus['ACTIVE']) {
        const isValidPassword = await validatePasswordEncryption(
          password,
          userResult?.password
        );
        if (isValidPassword) {
          const payload = {
            fullName: userResult?.fullName,
            userId: userResult?._id,
            userType: userResult?.userType,
            email: userResult?.email,
            phoneNumber: userResult?.phoneNumber,
            status: userResult?.status,
          };
          const token = jwtTokenCreate(payload);
          payload.token = token;
          await sessionModel.create({
            userId: userResult?._id,
            token,
            ip: ipAddress,
            status: { $ne: userStatus['DELETED'] },
          });
          return payload;
        }
        return false;
      }
      return { status: userStatus['INACTIVE'] };
    }
    return false;
  } catch (error) {
    throw Error(error);
  }
};

module.exports.getUserDetail = async (body) => {
  try {
    const { userId } = body;
    let query = { _id: userId, status: { $ne: userStatus['DELETED'] } };
    return await userModel.findOne(query, {
      resetToken: 0,
      password: 0,
      updatedAt: 0,
      __v: 0,
    });
  } catch (error) {
    throw Error(error);
  }
};

module.exports.checkSession = async (body) => {
  try {
    const { userId, token } = body;
    let query = { userId, token, status: { $ne: userStatus['DELETED'] } };
    return await sessionModel.findOne(query);
  } catch (error) {
    throw Error(error);
  }
};

module.exports.userLogout = async (body) => {
  try {
    const { userId } = body;
    let query = { userId };
    return await sessionModel.updateMany(query, {
      $set: { status: { $ne: userStatus['DELETED'] } },
    });
  } catch (error) {
    throw Error(error);
  }
};

module.exports.updateUser = async (req) => {
  try {
    const {
      body,
      params: { id },
      loginUser: { userId },
    } = req;

    if (id) {
      body.email = body?.email;
    }

    body.fullName = body?.name;
    return await userModel.findOneAndUpdate(
      { _id: objectId(id ?? userId) },
      { $set: body },
      {
        returnDocument: 'after',
        projection: {
          resetToken: 0,
          password: 0,
          updatedAt: 0,
          __v: 0,
        },
      }
    );
  } catch (error) {
    throw Error(error);
  }
};
