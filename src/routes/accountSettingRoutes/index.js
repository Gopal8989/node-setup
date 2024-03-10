const app = require('express').Router();
const userRouter = require('./user.route');
app.use([userRouter]);

module.exports = app;
