const express = require('express');
const moneroRpc = require('./moneroRpc');
const rpcMethods = require('./rpcMethods').module;
const auth = require('../middlewares/auth');
const router = express.Router();

function forwardRpc(req, res, service) {
  moneroRpc[service](req)
    .then((body) => {
      res.send(body);
    })
    .catch((err) => {
      console.error(err);
    });
}

function handleRpc(req, res) {
  // TODO: request validation
  var method = req.body.method;
  if (method in rpcMethods) {
    rpcMethods[method](req.body)
      .then((result) => {
        result.jsonrpc = "2.0";
        result.id = req.body.id;
        res.send(result);
      });
  }
  else {
    res.send({
      jsonrpc: "2.0",
      id: req.body.id,
      error: {
        code: -32601,
        message: 'Method not found'
      }
    });
  }

}

router
  .all('/*', auth, (req, res, next) => {
    next();
  })
  .post('/', handleRpc)
  .post('/daemon', (req, res) => {
    forwardRpc(req, res, 'daemon');
  })
  .post('/wallet', (req, res) => {
    forwardRpc(req, res, 'wallet');
  });

module.exports = router;
