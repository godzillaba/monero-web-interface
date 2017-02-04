const nativeDns = require('native-dns');
const dns = require('dns');

function formatResponse(data) {
  var result = [];
  for (var i = 0; i < data.length; i++) {
    result.push(data[i].data);
  }
  return result;
}

// DNSSEC?

function defaultLookup(name) {
  return new Promise(function(resolve, reject) {
    // use defaults
    dns.resolve(name, 'TXT', (err, addrs) => {
      if (err) reject(err);
      else resolve(addrs);
    });
  });
}

function customLookup(name, server) {
  return new Promise(function(resolve, reject) {
    // use custom server
    var q = nativeDns.Question({
      name: name,
      type: 'TXT'
    });
    var req = nativeDns.Request({
      question: q,
      server: server,
      timeout: 1000
    });
    req.on('timeout', () => {
      reject(new Error('DNS lookup timed out'));
    });
    req.on('message', (err, res) => {
      if (err) reject(err);
      else resolve(formatResponse(res.answer));
    });
    req.send();
  });
}

module.exports = function(name, server) {
  if (typeof server === 'undefined') {
    return defaultLookup(name);
  }
  else {
    return customLookup(name, server);
  }
}
