const mongoose = require('mongoose');

const mongoConnect = (callback) => {
  mongoose
    .connect(
      'mongodb+srv://nodeCourse:rG6lt680UwxFJ7YR@cluster0.wskuosz.mongodb.net/?retryWrites=true&w=majority'
    )
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
