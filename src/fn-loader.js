var fs = require('fs');
var getFSOpt = require('./fs-opt');

function fnLoader(file, cache) {
  return {
    sync: getFileSync,
    async: getFile
  };
  function getFileSync() {
    if ( !cache ) {
      cache = fs.readFileSync(file, getFSOpt());
    }
    return cache;
  }
  function getFile(callback) {
    if ( !cache ) {
      fs.readFile(file, getFSOpt(), resolve);
      return;
    }
    process.nextTick(resolve);
    return;
    function resolve(err, data) {
      if (data && !err) cache = data;
      callback(err, cache);
    }
  }
}

module.exports = fnLoader;
