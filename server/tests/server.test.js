'use strict';

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const app = require('./../server');

require('./user.test.js');
require('./farm.test.js');
require('./rain.test.js');

const {populateUsers, populateFarms, populateRain} = require('./seed/seed-data');

beforeEach(populateUsers);
beforeEach(populateFarms);
beforeEach(populateRain);
