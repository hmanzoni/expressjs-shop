const mongoose = require('mongoose');

MONGODB_URI =
  'mongodb+srv://nodeCourse:rG6lt680UwxFJ7YR@cluster0.wskuosz.mongodb.net/?retryWrites=true&w=majority';

const mongoConnect = (callback) => {
  mongoose
    .connect(MONGODB_URI)
    .then((client) => {
      console.log('Connected!');
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.mongoConnect = mongoConnect;
exports.MONGODB_URI = MONGODB_URI;
