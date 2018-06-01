var express = require('express');

var Farm = require('../models/farm');

var router = express.Router();

router.get('/', function(req, res, next) {
  Farm.find()
    .exec(function(err, messages) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(200).json({
        message: 'Success',
        obj: messages
      });
    });
});

module.exports = router;
