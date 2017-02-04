const dnsLookup = require('../../helpers/dnsLookup');
const config = require('config');

var server;
if (config.dns.customServer) {
  server = config.dns.server;
}

function parseTxtRecord(recString) {
  // NOTE: this function will only work on the most basic case (no double quotes or weird ; placement)
  recString = recString.trim();
  if (recString.substring(0,8) != 'oa1:xmr ') return null;
  recString = recString.substring(8);

  var record = {};

  var ss = recString.split(';');
  for (var i = 0; i < ss.length; i++) {
    var pair = ss[i].trim().split('=');
    if (pair[0] != '') {
      if (pair.length != 2) return null;
      record[pair[0]] = pair[1];
    }
  }
  return record;
}


module.exports = function(body) {
  return dnsLookup(body.params.name, server)
    .then((data) => {
      result = {};
      for (var i = 0; i < data.length; i++) {
        var pr = parseTxtRecord(data[i][0]);
        if (pr) {
          result = pr;
          result.record = data[i][0];
          break;
        }
      }
      return {result: result};
    })
    .catch((err) => {
      var rpcError = {
        code: -1,
        message: err.message
      };
      return {error: rpcError};
    });
};
