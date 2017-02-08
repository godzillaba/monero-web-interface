const nativeDns = require('native-dns');
const dns = require('dns');

// takes array of record objects and returns 2d array
function formatResponse(data) {
  var result = [];
  for (var i = 0; i < data.length; i++) {
    result.push(data[i].data);
  }
  return result;
}

// returns 2d array
function defaultLookup(name) {
  return new Promise(function(resolve, reject) {
    dns.resolve(name, 'TXT', (err, addrs) => {
      // default dns does throws NOTFOUND error whereas native-dns does not
      if (err && err.code != 'ENOTFOUND')
        reject(err);
      else
        resolve(addrs || []);
    });
  });
}

// returns array of record objects
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
      else resolve(res.answer);
    });
    req.send();
  });
}

module.exports = function(name, server) {
  if (typeof server === 'undefined') {
    return defaultLookup(name);
  }
  else {
    return customLookup(name, server)
      .then((data) => {
        return formatResponse(data);
      });
  }
}
