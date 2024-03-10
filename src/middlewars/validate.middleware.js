const createHttpError = require('http-errors');
const message = require('../messages/en');
const middleware = (schema, property) => async (req, res, next) => {
  const { error } = schema.validate(req[property || 'body']);
  const valid = error == null;
  if (valid) {
    next();
  } else {
    const { details } = error;
    console.log(details[0]);
    let msg = message[details[0]?.message] ?? details[0]?.message;
    msg = msg.charAt(1).toUpperCase() + msg.slice(2);
    msg = msg.replace(new RegExp('"', 'g'), '');
    return next(createHttpError.BadRequest(msg));
  }
};
module.exports = middleware;
