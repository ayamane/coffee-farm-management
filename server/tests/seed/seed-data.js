const { ObjectID } = require('mongodb');
//const jwt = require('jsonwebtoken');

const { User } = require('./../../models/user');
const { Farm } = require('./../../models/farm');
const { Rain } = require('./../../models/rain');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const farmOneId = new ObjectID();
const farmTwoId = new ObjectID();
const rainOneId = new ObjectID();

const users = [{
  _id: userOneId,
  firstName: 'Andrew',
  lastName: 'Tester',
  email: 'andrew@example.com',
  password: 'userOnePass'
  /*tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]*/
}, {
  _id: userTwoId,
  firstName: 'John',
  lastName: 'Tester',
  email: 'john@example.com',
  password: 'userTwoPass'
  /*tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]*/
}];

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

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

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
  users,
  populateUsers,
  farms,
  populateFarms,
  rain,
  populateRain
}
