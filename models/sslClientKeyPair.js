var pem = require('pem');
var deasync = require('deasync');
var KeyPair = require('./sslKeyPair');
var createCertSync = require('../helpers/createCertSync');

var createPkcs12Sync = deasync(pem.createPkcs12);

exports.createSync = function(commonName, password) {
  var rca = KeyPair.getSync('rootCA');
  var client = new KeyPair({
    serviceKey: rca.get('key'),
    serviceCertificate: rca.get('cert'),
    commonName: commonName
  });
  return createPkcs12Sync(client.get('key'), client.get('cert'), password);
}
