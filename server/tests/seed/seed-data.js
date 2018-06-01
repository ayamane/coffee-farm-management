const { ObjectID } = require('mongodb');

const { Farm } = require('./../../models/farm');
const { Rain } = require('./../../models/rain');

var farmOneId = new ObjectID();
var farmTwoId = new ObjectID();
var rainOneId = new ObjectID();

const farms = [{
  _id: farmOneId,
  name: 'First test farm'
}, {
  _id: farmTwoId,
  name: 'Second test farm'
}];

const rain = [
  {
    _id: new ObjectID(),
    _farm: farmOneId,
    date: new Date(2018,1,1),
    amount: 1.2,
    dimension: 'cm'
  },
  {
    _id: new ObjectID(),
    _farm: farmOneId,
    date: new Date(2018,1,2),
    amount: 0.3,
    dimension: 'cm'
  },
  {
    _id: new ObjectID(),
    _farm: farmOneId,
    date: new Date(2018,1,3),
    amount: 2.3,
    dimension: 'cm'
  },
  {
    _id: new ObjectID(),
    _farm: farmTwoId,
    date: new Date(2018,1,4),
    amount: 4.1,
    dimension: 'cm'
  },
  {
    _id: new ObjectID(),
    _farm: farmTwoId,
    date: new Date(2018,1,5),
    amount: 0.6,
    dimension: 'cm'
  }
];

const populateFarms = (done) => {
  Farm.remove({}).then(() => {
    return Farm.insertMany(farms);
  }).then(() => done());
};

const populateRain = (done) => {
  Rain.remove({}).then(() => {
    return Rain.insertMany(rain);
  }).then(() => done());
};

module.exports = {
  farms,
  populateFarms,
  rain,
  populateRain
}
