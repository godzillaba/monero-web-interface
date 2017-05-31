const pem = require('pem');
const deasync = require('deasync');
const KeyPair = require('./sslKeyPair');
const createCertSync = require('../helpers/createCertSync');

const createPkcs12Sync = deasync(pem.createPkcs12);

exports.createSync = function(commonName, password) {
  var rca = KeyPair.getSync('rootCA');
  var client = new KeyPair({
    serviceKey: rca.get('key'),
    serviceCertificate: rca.get('cert'),
    commonName: commonName
  });
  return createPkcs12Sync(client.get('key'), client.get('cert'), password);
}
