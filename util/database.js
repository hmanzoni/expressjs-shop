const mongoose = require('mongoose');

MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER_ID}/${process.env.MONGO_DEFAULT_DB}?retryWrites=true&w=majority`;

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
