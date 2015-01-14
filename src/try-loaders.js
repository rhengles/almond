
function tryLoaders(loaders) {
  return {
    sync: tryLoadersSync,
    async: tryLoadersAsync
  };
  function tryLoadersSync() {
    var errors = [],
        count = loaders.length,
        data;
    for ( var i = 0; i < count; i++ ) {
      try {
        return loaders[i].sync();
      } catch (e) {
        errors.push(e);
      }
    }
    if ( errors.length ) {
      throw errors;
    }
  }
  function tryLoadersAsync(callback) {
    var errors = [],
        count = loaders.length,
        current = 0;
    tryLoader();
    function tryLoader() {
      var loader = loaders[current];
      if ( loader ) {
        loader.async(function(err, data) {
          if ( err ) {
            errors.push(err);
            current++;
            process.nextTick(tryLoader);
            return;
          }
          callback(null, data);
        });
      } else {
        callback(errors.length ? errors : null, null);
      }
    }
  }
}

module.exports = tryLoaders;
