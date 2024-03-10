const { configDotenv } = require('dotenv');

switch (process.env.NODE_ENV) {
  case 'production':
    configDotenv({
      path: '.env.production',
    });
    break;
  default:
    configDotenv({
      path: '.env',
    });
}
module.exports = {
  db: {
    DB_URL: process.env.DB_URL,
  },
  app: {
    port: process.env.PORT,
    environment: process.env.NODE_ENV,
    jwtExpiresIn: process.env.JWT_EXPIRE,
    secretKey: process.env.SECRET_KEY,
    baseUrl: process.env.BASE_URL,
    frontendUrl: process.env.FRONTEND_URL,
    fileDestination: process.env.UPLOAD_DIR ?? 'public',
    fileSize: 1000000, // 1000000 Bytes = 1 MB
    swaggerHost: process.env.SWAGGER_HOST,
  },
  seed: {
    adminEmail: process.env.ADMIN_EMAIL || 'super@mailinator.com',
    adminPassword: process.env.ADMIN_PASSWORD,
  },
  smtp: {
    mailFrom: process.env.SMTP_MAIL_FROM,
    isMailSend: false,
    email: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
  },
};
