var express = require('express');
var bcrypt = require('bcrypt');

var User = require('../models/user');

var router = express.Router();

router.post('/', (req, res, next) => {
  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err, result) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    res.status(201).json({
      message: 'User created',
      obj: result
    });
  });
});

module.exports = router;
