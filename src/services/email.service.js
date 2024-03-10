const nodemailer = require('nodemailer');
const {
  smtp: { mailFrom, isMailSend, email },
} = require('../config/index');
const { logger } = require('../services/winston.service');
const message = require('../messages/en');

module.exports.sendMail = (emailBody) => {
  try {
    const transporter = nodemailer.createTransport(email);

    const mailOptions = {
      from: mailFrom,
      to: emailBody?.to,
      subject: message[emailBody?.subject] || emailBody?.subject,
      html: emailBody?.message,
    };

    if (emailBody?.cc) {
      mailOptions.cc = emailBody?.cc;
    }
    if (emailBody?.bcc) {
      mailOptions.bcc = emailBody?.bcc;
    }
    if (emailBody?.attachment) {
      mailOptions.attachment = emailBody?.attachment;
    }
    // if (isMailSend === false) {
    //   return true;
    // }
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger('email-error').error(error);
          reject(error);
        } else {
          logger('email-info').info(info);
          resolve(info);
        }
      });
    });
  } catch (error) {
    throw Error(error);
  }
};
