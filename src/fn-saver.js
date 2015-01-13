var fs = require('fs');
var path = require('path');
var getFSOpt = require('./fs-opt');

function fnSaver(file) {
  return {
    sync: setFileSync,
    async: setFile
  };
  function setFileSync(src) {
    fs.writeFileSync(file, src, getFSOpt());
  }
  function setFile(src, callback) {
    fs.writeFile(file, src, getFSOpt(), callback);
  }
}

module.exports = fnSaver;
