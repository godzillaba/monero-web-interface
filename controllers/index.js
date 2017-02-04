var express = require('express');
var auth = require('../middlewares/auth');
var router = express.Router();
var path = require('path');

router
  .use('/jsonRPC', require('./jsonRPC'))
  .use('/home', require('./home'))
  .use('/requestCert', require('./requestCert'))
  .get('/', auth, (req, res) => {
    res.redirect('/home/')
  });

module.exports = router;
