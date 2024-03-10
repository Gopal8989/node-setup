const Router = require('express');
const createHttpError = require('http-errors');
const accountSettingRouteIndex = require('./accountSettingRoutes/index');

const message = require('../messages/en');
const { logger } = require('../services/winston.service');
const router = Router();
const register = (app) => {
  app.use(router);

  router.use('/api', [accountSettingRouteIndex]);

  app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    res.status(error.status).json({
      success: false,
      data: null,
      error,
      message: error.message,
    });
  });
  // success response handler
  app.use((data, req, res, next) => {
    if (!createHttpError.isHttpError(data) && !(data instanceof Error)) {
      res.status(200).send({
        success: true,
        message: message[data?.message] || data?.message,
        data: data?.data ?? {},
      });
    } else {
      next(data);
    }
  });

  // error response handler
  app.use((err, req, res, next) => {
    const { status = 500 } = err;
    const message = status === 500 ? 'Something Went Wrong' : err.message;
    status === 500 && logger('server-error').error(err);
    status === 500 && console.log(err);
    res.statusMessage = message;
    res.status(status).send({
      success: false,
      message,
      data: null,
    });
  });
};
module.exports = register;
