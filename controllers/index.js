var express = require('express');
var auth = require('../middlewares/auth');
var router = express.Router();
var path = require('path');

router.use('/home', require('./home'));
router.use('/requestCert', require('./requestCert'));
router.use('/jsonRPC', require('./jsonRPC'));

router.get('/', auth, (req, res) => {
  res.redirect('/home/')
})

module.exports = router;
