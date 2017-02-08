const dnsLookup = require('../../helpers/dnsLookup');
const config = require('config');

var server;
if (config.dns.customServer) {
  server = config.dns.server;
}

// takes express request body (req.body) and
// returns promise with result object
module.exports = function(body) {
  return dnsLookup(body.params.name, server)
    .then((data) => {
      result = {};
      for (var i = 0; i < data.length; i++) {
        var parsed = parseTxt(data[i][0]);
        if (parsed) {
          result = parsed;
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

// takes single DNS TXT string as input and
// returns object with k/v pairs as defined in OpenAlias spec
function parseTxt(recString) {
  // NOTE: this function will only work on the most basic case (no double quotes or weird ; placement)
  // TODO: ROBUSTNESS
  recString = recString.trim();

  if (recString.substring(0,8) != 'oa1:xmr ') return null;

  recString = recString.substring(8);

  var record = {
    text: recString
  };

  var ss = recString.split(';');
  for (var i = 0; i < ss.length; i++) {
    var pair = ss[i].trim().split('=');
    if (pair[0] != '') {
      if (pair.length != 2) return null; // invalid format
      record[pair[0]] = pair[1];
    }
  }
  return record;
}
