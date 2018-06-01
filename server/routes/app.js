var express = require('express');
// var User = require('../models/user');

var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index');
});

module.exports = router;
