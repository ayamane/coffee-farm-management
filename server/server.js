require('./config/config');

//const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Farm } = require('./models/farm');
var { Rain } = require('./models/rain');
// var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

if (app.get('env') !== 'test') {
  app.use(logger('dev'));
}
app.use(bodyParser.json());

app.get('/farms', /*authenticate,*/ (req, res) => {
  Farm.find({}).then((farms) => {
    res.send({farms});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/farms', /*authenticate,*/ (req, res) => {
  var farm = new Farm({
    name: req.body.name
  });

  farm.save().then((farm) => {
    res.header('_farm', farm._id).send(farm);
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /farms/12342342
app.get('/farms/:id', /*authenticate,*/ (req, res) => {
  var id = req.params.id;

  // validate ID using isValid
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Farm.findOne({
    _id: id
  }).then((farm) => {
    if (!farm) {
      return res.status(404).send();
    }

    res.header('_farm', farm._id).send({farm});
  }).catch ((e) => res.status(400).send());
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

    rain.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
  });
});

app.get('/rain/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Rain.findOne({
    _id: id
  }).then((rain) => {
    if (!rain) {
      return res.status(404).send();
    }
    res.send({rain});
  }).catch ((e) => res.status(400).send());
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
