var express = require('express');

var Farm = require('../models/farm');

var router = express.Router();

router.get('/',(req, res) => {
  Farm.find()
    .exec(function(err, farms) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(200).json({
        message: 'Success',
        obj: farms
      });
    });
});

router.post('/', (req, res) => {
  var farm = new Farm({
    name: req.body.name
  });

  farm.save(function(err, result) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    res.status(201).json({
      message: 'Farm created',
      obj: result
    });
  });
});

// GET /farms/12342342
router.get('/:id', (req, res) => {
  Farm.findById(req.params.id, function(err, farm) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    if (!farm) {
      return res.status(404).json({
        title: 'No Farm Found!',
        error: { message: 'Farm not found' }
      });
    }
    res.status(200).json({
      message: 'Success',
      obj: farm
    });
  });
});

module.exports = router;
