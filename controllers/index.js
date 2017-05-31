const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const path = require('path');

router
  .use('/jsonRPC', require('./jsonRPC'))
  .use('/home', require('./home'))
  .use('/requestCert', require('./requestCert'))
  .get('/', auth, (req, res) => {
    res.redirect('/home/')
  });

module.exports = router;
