var express = require('express');
var config = require('config');
var request = require('request');
var auth = require('../middlewares/auth');
var router = express.Router();

function forwardRPC(req, res, destPort) {
  var opts = {
    headers: {
      'content-type': 'application/json'
    },
    url: 'http://localhost:' + destPort + '/json_rpc',
    body: JSON.stringify(req.body)
  }
  request.post(opts, function(error, res2, body) {
    res.send(body);
  });
}

router
  .all('/*', auth, (req, res, next) => {
    next();
  })
  .post('/daemon', (req, res) => {
    forwardRPC(req, res, config.moneroTools.daemonPort);
  })
  .post('/wallet', (req, res) => {
    forwardRPC(req, res, config.moneroTools.walletPort);
  });

module.exports = router;
