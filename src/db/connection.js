const mongoose = require('mongoose');
const config = require('../config/index.js');
const {
  db: { DB_URL },
} = config;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((link) => {
    // console.log('Database connected.');
  })
  .catch((error) => {
    console.log(error);
    console.log('Database not connected.');
  });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('Connected successfully');
});
module.exports = db;
