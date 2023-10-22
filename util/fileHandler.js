const fs = require('fs');

exports.saveFile = (path, dataJson, cb = errorPrint) => {
  fs.writeFile(path, JSON.stringify(dataJson), cb);
};

exports.getFile = (path, cb) => {
  fs.readFile(path, cb);
};

exports.deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
};

function errorPrint(err) {
  console.log(err);
}
