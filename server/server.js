require('./config/config');

var express = require('express');
var bcrypt = require('bcrypt');
//var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var logger = require('morgan');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');

var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var farmRoutes = require('./routes/farm');
var rainRoutes = require('./routes/rain');

var app = express();
const port = process.env.PORT;

if (app.get('env') !== 'test') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/rain', rainRoutes);
app.use('/farms', farmRoutes);
app.use('/users', userRoutes);
app.use('/', appRoutes);

app.listen(port, () => {
  console.log(`Started CFMA on port ${port}`);
});

module.exports = app;
