var express = require('express');

var Rain = require('../models/rain');
var Farm = require('../models/farm');

var router = express.Router();

router.get('/', (req, res) => {
  Rain.find()
    .exec(function(err, rains) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(200).json({
        message: 'Success',
        obj: rains
      });
    });
});

router.post('/', (req, res) => {
  Farm.findById(req.body._farm, function(err, farm) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    if (!farm) {
      return res.status(404).json({
        title: 'Farm not found!',
        error: err
      });
    }
    var rain = new Rain({
      _farm: req.body._farm,
      date: req.body.date,
      amount: req.body.amount,
      dimension: req.body.dimension
    });

    rain.save(function(err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(201).json({
        message: 'Rain document created',
        obj: result
      });
    });
  });
});

router.get('/:id', (req, res) => {
  Rain.findById(req.params.id, function(err, rain) {
    if (err) {
      return res.status(500).json({
        title: 'An error occurred',
        error: err
      });
    }
    if (!rain) {
      return res.status(404).json({
        title: 'No Farm Found!',
        error: { message: 'Rain document not found' }
      });
    }
    res.status(200).json({
      message: 'Success',
      obj: rain
    });
  });
});

router.get('/farm/:farm', (req, res) => {
  Farm.findById(req.params.farm, function(err, farm) {
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

  Rain.find({_farm: farm._id})
    .exec(function(err, rains) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }
      res.status(200).json({
        message: 'Success',
        obj: rains
      });
    });
  });
});

module.exports = router;
