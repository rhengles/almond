
function fnCache(loaderSource, loaderCache, saverCache) {
  var cache;
  return {
    sync: getCacheSync,
    async: getCache
  };
  function getCacheSync() {
    if ( !cache ) {
      try {
        cache = loaderSource.sync();
      } catch (e) {
      }
      if ( !cache ) {
        cache = loaderCache.sync();
        saverCache.sync(cache);
      }
    }
    return cache;
  }
  function getCache(callback) {
    if ( cache ) {
      process.nextTick(resolveCache);
      return;
    }
    loaderSource.async(loaderSourceCallback);
    return;
    function resolveCache() {
      callback(null, cache);
    }
    function loaderSourceCallback(err, data) {
      if ( err ) {
        loaderCache.async(loaderCacheCallback);
        return;
      }
      cache = data;
      saverCache.async(cache, saverCacheCallback);
    }
    function loaderCacheCallback(err, data) {
      if ( err ) {
        callback(err, data);
        return;
      }
      cache = data;
      callback(err, cache);
    }
    function saverCacheCallback(err) {
      callback(err, cache);
    }
  }
}

module.exports = fnCache;
