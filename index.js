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
      c_load = opt.loadCache && fnLoader(c_path),
      c_save = opt.saveCache && fnSaver(c_path)
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

function cli(opt) {

  if ( !opt.path && null == opt.source ) {
    console.error(
      [ 'Usage: "node almond-wrap/ path/to/almond.js"',
      , '"node almond-wrap/ -io < path/to/almond.js > output.js"',
      , '',
      , 'Options:',
      , '  -l --loadcache: load compiled file from cache if source not found',
      , '  -L --no-loadcache: do not load from cache [default]',
      , '  -s --savecache: save compiled file to cache [default]',
      , '  -S --no-savecache: do not save to cache',
      , '  -i --stdin: read almond from stdin',
      , '  -I --no-stdin: do not read from stdin [default]',
      , '  -o --stdout: print compiled file to stdout',
      , '  -O --no-stdout: do not print to stdout [default]',
      , '',
      , 'default options: -sLIO (short for the following:)',
      , '  --savecache',
      , '  --no-loadcache',
      , '  --no-stdin',
      , '  --no-stdout'
      ].join('\n').replace(/\n\n/g, '\n') // ??
    );
    process.exit(1);
  }
  almondWrap(opt).async(function(err, data) {
    if ( err ) {
      console.error(err);
      process.exit(1);
    } else if ( opt.stdOut ) {
      if ( data ) {
        console.error('Data: '+data.length+' chars');
        process.stdout.write(data);
      } else {
        console.error('No data');
      }
    }
  });
}

var opt = {
      saveCache: true,
      loadCache: false,
      stdIn: false,
      stdOut: false,
      path: null,
      source: null
    },
    args = {
      saveCache: 's',
      loadCache: 'l',
      stdIn    : 'i',
      stdOut   : 'o'
    },
    nameArgs = [];

opt = cliOpts(process.argv.slice(2), opt, args, nameArgs);

opt.path = nameArgs[0] || null;

if ( opt.stdIn ) {
  stConcat(process.stdin, function(data) {
    console.error(opt);
    console.error('Data from stdIn: '+data.length+' chars');
    opt.source = data;
    cli(opt);
  });
} else {
  console.error(opt);
  cli(opt);
}

}