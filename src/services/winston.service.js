const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

const datePattern = 'YYYY-MM-DD';
// const maxSize = '5mb';
// const zippedArchive = false;
// const maxFiles = '30d';

function createLogger(transport, level) {
  return winston.createLogger({
    level: level || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports: [transport],
  });
}

function dailyLogger(object) {
  const { name, level } = object;
  const transport = new winston.transports.DailyRotateFile({
    name,
    filename: path.join(__dirname, '../', 'logs/%DATE%', `${name}.log`),
    datePattern,
  });
  return createLogger(transport, level);
}

module.exports.logger = (data) => dailyLogger({ name: data });
