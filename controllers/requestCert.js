const express = require('express');
const router = express.Router();
const ClientKeyPair = require('../models/sslClientKeyPair');

function randString(len, numeric=false) {
  var alpha = 'abcdefghijklmnopqrstuvwxyz';
  var nums = '0123456789';
  var chars = nums;
  var result = '';
  if (!numeric)
    chars += alpha;
  for (var i = 0; i < len; i++)
    result += chars[Math.floor(Math.random()*chars.length)];
  return result;
}

function newCertCodes() {
  certReqCode = randString(6, true);
  certPass = randString(8);
  console.log('\n\nCERTIFICATE REQUEST CODE: ' + certReqCode);
  console.log('CERTIFICATE PASSWORD: ' + certPass);
  console.log('\n');
}
function clearCertCodes() {
  certReqCode = certPass = '';
}
var certReqCode = '', certPass = '';

router
  .get('/', (req, res) => {
    newCertCodes();
    res.render('../views/requestCert/index.pug');
  })
  .get('/client.pfx', (req, res) => {
    if (certReqCode && certReqCode == req.query.code) {
      res.type('pfx');
      res.send(ClientKeyPair.createSync(req.query.cn, certPass).pkcs12);
    }
    else {
      res.send('401 - wrong code dumbass') // TODO: this duh
    }
    clearCertCodes();
  });

module.exports = router;
