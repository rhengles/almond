
function hasOwn(obj, prop) {
  return {}.hasOwnProperty.call(obj, prop);
}
function cliOpts(argv, opt) {
  var args = {
        saveCache: 's',
        loadCache: 'l',
        stdOut: 'o'
      },
      argsLower = {},
      keys = {},
      count = argv.length,
      h = '-',
      noh = 'no-';
  opt || (opt = {});
  for ( var i in args ) {
    if ( !hasOwn(args, i) ) continue;
    keys[args[i]] = i;
    argsLower[i.toLowerCase()] = i;
  }
  for ( var i = 0; i < count; i++ ) {
    var a = argv[i];
    if ( a.charAt(0) === h ) {
      if ( a.charAt(1) === h ) {
        var n = a.substr(2,3) === noh;
        var name = argsLower[a.substr(n ? 5 : 2).toLowerCase()];
        if ( name in args ) {
          opt[name] = !n;
        }
      } else {
        var chars = a.length;
        for ( var j = 1; j < chars; j++ ) {
          var name = a[j];
          var lower = name.toLowerCase();
          var n = name !== lower;
          if ( lower in keys ) {
            opt[keys[lower]] = !n;
          }
        }
      }
    }
  }
  return opt;
}

module.exports = cliOpts;
