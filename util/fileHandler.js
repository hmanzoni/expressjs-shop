const fs = require('fs');

exports.saveFile = (path, dataJson, cb = errorPrint) => {
  fs.writeFile(path, JSON.stringify(dataJson), cb);
};

exports.getFile = (path, cb) => {
  fs.readFile(path, cb);
};

function errorPrint(err) {
  console.log(err);
}
