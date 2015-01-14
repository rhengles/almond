var tryLoaders = require('./try-loaders');

function fnCache(loaderSource, loaderCache, saverCache) {
  var cache,
      loaders = [].concat(
        loaderSource || [],
        loaderCache  || []
      );
  return {
    sync: getCacheSync,
    async: getCache
  };
  function getCacheSync() {
    if ( !cache ) {
      cache = tryLoaders(loaders).sync();
      if ( saverCache ) {
        saverCache.sync(cache);
      }
    }
    return cache;
  }
  function getCache(callback) {
    //console.error('c1');
    if ( cache ) {
      //console.error('c2');
      process.nextTick(resolveCache);
      return;
    }
    tryLoaders(loaders).async(loaderCallback);
    //console.error('c3');
    return;
    function resolveCache() {
      //console.error('c4');
      callback(null, cache);
    }
    function loaderCallback(err, data) {
      //console.error('c5');
      if ( err ) {
        //console.error('c6');
        callback(err, data);
        return;
      }
      cache = data;
      if ( saverCache ) {
        //console.error('c7');
        saverCache.async(cache, saverCacheCallback);
      } else {
        //console.error('c8');
        resolveCache();
      }
    }
    function saverCacheCallback(err) {
      //console.error('c9');
      callback(err, cache);
    }
  }
}

module.exports = fnCache;
