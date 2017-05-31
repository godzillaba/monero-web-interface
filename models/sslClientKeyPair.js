var pem = require('pem');
var deasync = require('deasync');
var KeyPair = require('./sslKeyPair');
var createCertSync = require('../helpers/createCertSync');

var createPkcs12Sync = deasync(pem.createPkcs12);

exports.createSync = function(commonName, password) {
  var rca = KeyPair.getSync('rootCA');
  var client = createCertSync({
    serviceKey: rca.key,
    serviceCertificate: rca.cert,
    commonName: commonName,
    altNames: [commonName]
  });
  return createPkcs12Sync(client.key, client.cert, password);
}
