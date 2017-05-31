const pem = require('pem');
const deasync = require('deasync');

const createCertificateSync = deasync(pem.createCertificate);

module.exports = function(opts) {
  var p = createCertificateSync(opts);
  return {
    key: p.clientKey,
    cert: p.certificate
  }
}
