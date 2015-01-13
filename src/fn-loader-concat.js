
function fnLoaderConcat(loaders) {
  var count = loaders.length;
  return {
    sync: concatSync,
    async: concat
  };
  function concatSync() {
    var result = '';
    for ( var i = 0; i < count; i++ ) {
      result = result.concat(loaders[i].sync());
    }
    return result;
  }
  function concat(callback) {
    var result = [],
        errors = [],
        remain = count;
    for ( var i = 0; i < count; i++ ) {
      loaders[i].async(fnResolve(i));
    }
    return;
    function resolve() {
      callback(errors.length ? errors : null, result.join(''));
    }
    function fnResolve(i) {
      return function(err, part) {
        result[i] = part;
        remain--;
        if ( err ) {
          errors.push( { index: i, error: err } );
        }
        if ( !remain ) {
          process.nextTick(resolve);
        }
      }
    }
  }
}

module.exports = fnLoaderConcat;
