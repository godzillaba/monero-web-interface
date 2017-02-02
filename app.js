var fs = require('fs');
var morgan = require('morgan');
var express = require('express');
var https = require('https');
var config = require('config');
var KeyPair = require('./models/sslKeyPair');
var moneroTools = require('./helpers/moneroTools');
var app = express();


function mtExit(error, stdout, stderr) {
  if (error) {
    console.error('\n' + error.cmd + '\n  Failed, exit code: ' + error.code);
    process.exit();
  }
}

var mtc = config.moneroTools;
moneroTools.startDaemon(mtExit)
  .then(() => {
    console.log('monerod listening on 127.0.0.1:' + mtc.daemonPort);
    return moneroTools.startWallet(mtExit);
  })
  .then(() => {
    console.log('monero-wallet-rpc listening on 127.0.0.1:' + mtc.walletPort);
  });


if (!KeyPair.getSync('rootCA') || !KeyPair.getSync('server')) {
  // generate new keys
  KeyPair.createSync('rootCA', {
    selfSigned: true,
    commonName: config.sslKeys.rootCA.commonName
  });
  KeyPair.createSync('server', {
    serviceKey: KeyPair.getSync('rootCA').key,
    serviceCertificate: KeyPair.getSync('rootCA').cert,
    commonName: config.sslKeys.server.commonName
  });

  fs.writeFileSync('./data/ca.pem', KeyPair.getSync('rootCA').cert);
}

morgan.token('remote-user', (req, res) => {
  var s = req.socket.getPeerCertificate().subject;
  if (s)
    return s.CN;
  else
    return null;
});

app
  .set('view engine', 'pug')
  .use(morgan('common'))
  .use('/public', express.static(__dirname + '/public'))
  .use('/node_modules', express.static(__dirname + '/node_modules'))
  .use(require('body-parser').json())
  .use(require('./controllers'));


var options = {
  key: KeyPair.getSync('server').key,
  cert: KeyPair.getSync('server').cert,
  ca: KeyPair.getSync('rootCA').cert,
  requestCert: true,
  rejectUnauthorized: false
}

var wsc = config.webServer;
https.createServer(options, app)
  .listen(wsc.port, wsc.host, (err) => {
    if (err) {
      console.error(err);
      process.exit();
    }
    console.log('express listening on ' + wsc.host + ':' + wsc.port);
  });
