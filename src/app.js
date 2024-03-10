const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createServer } = require('http');
const path = require('path');

const router = require('./routes/index');
const swaggerDocs = require('./services/swagger.service');
const { logger } = require('./services/winston.service');
const { seedData } = require('./db/seed');
require('../src/config/index.js');
require('./db/connection');
const app = express();
const httpServer = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL ?? '';
const allowedOrigins = FRONTEND_URL ? FRONTEND_URL.split(',') : [];
app.use(cors({ origin: allowedOrigins }));
app.use(express.static(__dirname + '../../'));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./src/ejs'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
    xXssProtection: false,
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `${FRONTEND_URL}`);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type'), next();
});

swaggerDocs(app);
router(app);

// Get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason, promise) => {
  logger('process-error').error(reason);
});

process.on('uncaughtException', (error) => {
  logger('process-error').error(error);
  // exit(0);
});

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
  seedData();
});
