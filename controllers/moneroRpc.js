const config = require('config');
const request = require('request');

function forwardRPC(req, destPort, callback) {
  var opts = {
    headers: {
      'content-type': 'application/json'
    },
    url: 'http://localhost:' + destPort + '/json_rpc',
    body: JSON.stringify(req.body)
  }
  return new Promise(function(resolve, reject) {
    request.post(opts, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      }
      else {
        reject(error || response);
      }
    });
  });
}

exports.wallet = function(req) {
  return forwardRPC(req, config.moneroTools.walletPort);
}
exports.daemon = function(req) {
  return forwardRPC(req, config.moneroTools.daemonPort);
}
