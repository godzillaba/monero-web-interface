var express = require('express');
var auth = require('../middlewares/auth');
var router = express.Router();

router
  .get('/', auth, (req, res) => {
    res.render('../views/home/index.pug');
  });

module.exports = router;
