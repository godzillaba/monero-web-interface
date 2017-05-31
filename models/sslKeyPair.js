const fs = require('fs');
const createCertSync = require('../helpers/createCertSync');
const KEYFILE = '../data/sslKeys.json';

module.exports = SslKeyPair;

function SslKeyPair(data, isNew=true) {
  if (isNew) {
    this.data = createCertSync(data);
    this.data.name = data.name;
  }
  else {
    this.data = data;
  }
}

SslKeyPair.prototype.get = function(attr) {
  return this.data[attr];
};
SslKeyPair.prototype.set = function(attr, value) {
  this.data[attr] = value;
}

SslKeyPair.prototype.save = function() {
  var k = readKeys();
  k[this.data.name] = this.data;
  writeKeys(k);
};

SslKeyPair.getSync = function(name) {
  var data = readKeys()[name];
  return data ? new SslKeyPair(data, false) : undefined;
};

function writeKeys(obj) {
  fs.writeFileSync(__dirname + '/' + KEYFILE, JSON.stringify(obj, null, 2));
}
function readKeys() {
  return require(KEYFILE);
}
