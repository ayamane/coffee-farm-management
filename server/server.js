require('./config/config');

var express = require('express');
var bcrypt = require('bcrypt');
//var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var logger = require('morgan');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Farm } = require('./models/farm');
var { Rain } = require('./models/rain');
var { User } = require('./models/user');

var app = express();
const port = process.env.PORT;

if (app.get('env') !== 'test') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());

app.post('/users', (req, res, next) => {
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

app.get('/farms',(req, res) => {
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

app.post('/farms', (req, res) => {
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
app.get('/farms/:id', (req, res) => {
  var id = req.params.id;

  // validate ID using isValid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Farm.findById(id, function(err, farm) {
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

app.get('/rain', (req, res) => {
  Rain.find({}).then((rain) => {
    res.send({rain});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/rain', (req, res) => {
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

app.get('/rain/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Rain.findById(id, function(err, rain) {
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

app.get('/rain/farm/:farm', (req, res) => {
  var farmId = req.params.farm;

  if (!ObjectID.isValid(farmId)) {
    return res.status(404).json({
      title: 'Farm not found!',
      error: err
    });
  }

  Rain.find({_farm: farmId})
    .then((rain) => {
      res.send({rain});
    }, (err) => {
      res.status(400).json({
        title: 'An error occurred',
        error: err
      });
    });
});

app.listen(port, () => {
  console.log(`Started CFMA on port ${port}`);
});

module.exports = { app };
