var path = require('path');
var fnLoader = require('./src/fn-loader');
var fnConcat = require('./src/fn-loader-concat');
var fnSaver  = require('./src/fn-saver');
var fnCache  = require('./src/fn-cache');
var stConcat = require('./src/stream-concat');
var cliOpts  = require('./src/cli-opts');

function getPath(file) {
  return path.join(__dirname, file);
}
function getLoader(file) {
  return fnLoader(getPath(file));
}

function almondWrap(opt) {

  var almond = fnLoader(opt.path, opt.source),
      before = getLoader('almond-before.jsfrag'),
      after  = getLoader('almond-after.jsfrag'),
      concat = fnConcat([before, almond, after]),
      c_path = getPath('almond-wrap.js'),
      c_load = /*opt.loadCache &&*/ fnLoader(c_path),
      c_save = /*opt.saveCache &&*/ fnSaver(c_path)
      cache  = fnCache(concat, c_load, c_save);

  concat.almond = almond;
  concat.before = before;
  concat.after  = after ;

  cache.reload = concat;

  return cache;

}

module.exports = almondWrap;

if ( require.main === module ) {
// User is calling directly from command line

var opt = {
      saveCache: true,
      loadCache: false,
      stdOut: false
    };

opt = cliOpts(process.argv.slice(2), opt);

stConcat(process.stdin, function(data) {
  var file = process.argv[2];
  if ( !file && null == data ) {
    console.error('Usage: '.concat(
      '"node almond-wrap/ [<] path/to/almond.js [> output.js]"\n',
      '\n',
      'Options:\n',
      '  -l --loadcache: load compiled file from cache if source not found\n',
      '  -L --no-loadcache: do not load from cache [default]\n',
      '  -s --savecache: save compiled file to cache [default]\n',
      '  -S --no-savecache: do not save to cache\n',
      '  -o --stdout: print compiled file to stdOut\n',
      '  -O --no-stdOut: do not print to stdOut\n',
      '\n',
      'default options: -LsO'
    ));
    process.exit(1);
  //} else {
  //  console.error(JSON.stringify([file, data]));
  }
  almondWrap({
    path: file,
    source: data
  }).async(function(err, data) {
    //console.error(JSON.stringify([file, data]));
    if ( err ) {
      console.error(err);
      process.exit(1);
    } else if ( data ) {
      process.stdout.write(data);
    }
  });
});

}