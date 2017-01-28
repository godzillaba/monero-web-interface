var fs = require('fs');
var createCertSync = require('../helpers/createCertSync');

const KEYFILE = '../data/sslKeys.json';

function writeKeys(obj) {
  fs.writeFileSync(__dirname + '/' + KEYFILE, JSON.stringify(obj, null, 2));
}
function readKeys() {
  return require(KEYFILE);
}

exports.createSync = function(name, opts) {
  var newPair = createCertSync(opts);
  var k = readKeys();
  k[name] = newPair;
  writeKeys(k);
  return newPair;
}

exports.getSync = function(name) {
  return readKeys()[name];
}
