const mongoose = require('mongoose');

const MONGODB_URL =
  process.env.MONGODB_URL || 'mongodb://localhost:27017/lms_backend';

const db_connect = () => {
  mongoose
    .connect(MONGODB_URL)
    .then((conn) => {
      console.log(`Connected to DB : ${conn.connection.host}`);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = db_connect;
