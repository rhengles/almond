
function streamConcat(stream, callback) {
  var data = '';
  stream.setEncoding('utf8');
  stream.on('readable', streamReadable);
  stream.on('end', cbOnce);
  return;
  function cbOnce() {
    callback(data || null);
    callback = null;
  }
  function streamReadable() {
    var chunk = stream.read();
    if ( null == chunk ) {
      cbOnce();
    } else {
      data += chunk;
    }
  }
}

module.exports = streamConcat;
