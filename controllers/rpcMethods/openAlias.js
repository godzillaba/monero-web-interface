const dnsLookup = require('../../helpers/dnsLookup');
const rpcRes = require('../../helpers/rpcResponse');
const config = require('config');

var server;
if (config.dns.customServer) {
  server = config.dns.server;
}

module.exports = function(body) {
  return dnsLookup(body.params.name, server)
    .then((data) => {
      return {result: data};
    })
    .catch((err) => {
      var rpcError = {
        code: -1,
        message: err.message
      };
      return {error: rpcError};
    });
};
