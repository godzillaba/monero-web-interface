var pem = require('pem');
var deasync = require('deasync');

var createCertificateSync = deasync(pem.createCertificate);

module.exports = function(opts) {
  var p = createCertificateSync(opts);
  return {
    key: p.clientKey,
    cert: p.certificate
  }
}
