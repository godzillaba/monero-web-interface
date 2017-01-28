var express = require('express');
var auth = require('../middlewares/auth');
var router = express.Router();

router
  .get('/', auth, (req, res) => {
    res.render('../views/home/index.pug');
  })
  .get('/:file', auth, (req, res) => {
    res.render('../views/home/' + req.params.file, {});
  });

module.exports = router;
