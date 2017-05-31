var fs = require('fs');
var createCertSync = require('../helpers/createCertSync');
const KEYFILE = '../data/sslKeys.json';

/**
 * SSL key pair data model
 * @module models/SslKeyPair
 */

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


//
//
// exports.createSync = createSync;
// exports.getSync = getSync;
//
// /**
//  * createSync - description
//  *
//  * @param  {string} name description
//  * @param  {string} opts description
//  * @return {string}      description
//  * @instance
//  */
// function createSync(name, opts) {
//   var newPair = createCertSync(opts);
//   var k = readKeys();
//   k[name] = newPair;
//   writeKeys(k);
//   return newPair;
// }
//
// function getSync(name) {
//   return readKeys()[name];
// }
