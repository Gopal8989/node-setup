const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { UPLOAD_IMAGE } = require('../messages/en');
const {
  app: { fileDestination, fileSize },
} = require('../config/index');

const multerStorage = multer.diskStorage({
  // Destination to store image
  destination: (req, file, cb) => {
    if (!fs.existsSync(fileDestination)) {
      fs.mkdirSync(fileDestination);
    }
    cb(null, `${fileDestination}`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});

const mediaUpload = multer({
  storage: multerStorage,
  limits: {
    fileSize: fileSize,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|svg)$/)) {
      // upload only png and jpg format
      return cb(new Error(UPLOAD_IMAGE));
    }
    cb(undefined, true);
  },
});

module.exports = mediaUpload;
