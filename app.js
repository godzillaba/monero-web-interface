const fs = require('fs');
const morgan = require('morgan');
const express = require('express');
const https = require('https');
const config = require('config');
const KeyPair = require('./models/sslKeyPair');
const moneroTools = require('./helpers/moneroTools');
const app = express();


function mtExit(error, stdout, stderr) {
  if (error) {
    console.error('\n' + error.cmd + '\n  Command exited with status: ' + error.code);
    if (error.code === 127)
      console.error('  make sure that monero tools are properly installed');
    process.exit(1);
  }
}

function generateKeys() {
  var rCaCn = config.sslKeys.rootCA.commonName;
  var srvCn = config.sslKeys.server.commonName;
  if (!rCaCn || !srvCn) {
    console.error('Please define sslKeys.rootCA.commonName and sslKeys.server.commonName in config/default.json');
    process.exit(1);
  }

  var rcap = new KeyPair({
    name: 'rootCA',
    selfSigned: true,
    commonName: rCaCn
  });

  var sp = new KeyPair({
    name: 'server',
    serviceKey: rcap.get('key'),
    serviceCertificate: rcap.get('cert'),
    commonName: srvCn,
    altNames: [srvCn]
  });

  rcap.save();
  sp.save();

  fs.writeFileSync('./data/ca.pem', rcap.get('cert'));
}

// TODO: make sure not already listening
var mtc = config.moneroTools;
moneroTools.startDaemon(mtExit)
  .then(() => {
    console.log('monerod listening on 127.0.0.1:' + mtc.daemonPort);
    return moneroTools.startWallet(mtExit);
  })
  .then(() => {
    console.log('monero-wallet-rpc listening on 127.0.0.1:' + mtc.walletPort);
  });


// generate new keys
if (!KeyPair.getSync('rootCA') || !KeyPair.getSync('server')) {
  generateKeys();
}

var sp = KeyPair.getSync('server');
var rcap = KeyPair.getSync('rootCA');
var options = {
  key: sp.get('key'),
  cert: sp.get('cert'),
  ca: rcap.get('cert'),
  requestCert: true,
  rejectUnauthorized: false
}

app
  .set('view engine', 'pug')
  .use(morgan('common'))
  .use('/public', express.static(__dirname + '/public'))
  .use('/node_modules', express.static(__dirname + '/node_modules'))
  .use(require('body-parser').json())
  .use(require('./controllers'));

morgan.token('remote-user', (req, res) => {
  var s = req.socket.getPeerCertificate();
  if (s && s.subject)
    return s.subject.CN;
  else
    return null;
});

var wsc = config.webServer;
https.createServer(options, app)
  .listen(wsc.port, wsc.host, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('express listening on ' + wsc.host + ':' + wsc.port);
  });
