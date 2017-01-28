var fs = require('fs');
var express = require('express');
var https = require('https');
var config = require('config');
var KeyPair = require('./models/sslKeyPair');
var moneroTools = require('./helpers/moneroTools');
var app = express();

var mtc = config.moneroTools;
moneroTools.startDaemon().then(() => {
  console.log('monerod listening on 127.0.0.1:' + mtc.daemonPort);
  moneroTools.startWallet().then(() => {
    console.log('monero-wallet-rpc listening on 127.0.0.1:' + mtc.walletPort);
  });
});

// generate new keys:
// KeyPair.createSync('rootCA', {
//     selfSigned: true,
//     commonName: config.sslKeys.rootCA.commonName
// });
// KeyPair.createSync('server', {
//     serviceKey: KeyPair.getSync('rootCA').key,
//     serviceCertificate: KeyPair.getSync('rootCA').cert,
//     commonName: config.sslKeys.server.commonName
// });

// fs.writeFileSync('./data/ca.pem', KeyPair.getSync('rootCA').cert);



app
  .set('view engine', 'pug')
  .use('/public', express.static(__dirname + '/public'))
  .use(require('body-parser').json())
  .use(require('./controllers'));


var options = {
  key: KeyPair.getSync('server').key,
  cert: KeyPair.getSync('server').cert,
  ca: KeyPair.getSync('rootCA').cert,
  requestCert: true,
  rejectUnauthorized: false
}

https.createServer(options, app)
  .listen(config.webServer.port, config.webServer.host, (err) => {
    if (err) {
      console.error(err);
      process.exit();
    }
    var wsc = config.webServer;
    console.log('express listening on ' + wsc.host + ':' + wsc.port);
  });
