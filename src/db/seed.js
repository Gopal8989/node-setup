const userModel = require('../models/user.model');

const {
  seed: { adminEmail, adminPassword },
} = require('../config/index');
const { userStatus } = require('../utils/constant.util');

const admins = [
  {
    fullName: 'super',
    email: adminEmail,
    password: adminPassword,
    userType: 'superAdmin',
    isOtpVerify: true,
    isDeleted: false,
    status: userStatus['ACTIVE'],
  },
];

module.exports.seedData = async () => {
  try {
    await Promise.allSettled(
      admins.map(async (e) => {
        let result = await userModel.findOne({
          email: e?.email,
          isDeleted: false,
        });
        if (!result) {
          await userModel.create(e);
        }
      })
    );
  } catch (err) {
    console.error(err);
  } finally {
    console.log('Mock data is seeded from seed script.');
  }
};
