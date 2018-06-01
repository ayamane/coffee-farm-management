'use strict';

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Farm} = require('./../models/farm');
const {Rain} = require('./../models/rain');
const {farms, populateFarms, rain, populateRain} = require('./seed/seed-data');

beforeEach(populateFarms);
beforeEach(populateRain);

describe('*********** FARMS ***********', () => {
  describe('GET /farms', () => {
    it('should get all farms', (done) => {
      request(app)
        .get('/farms')
        .expect(200)
        .expect((res) => {
          expect(res.body.farms.length).toBe(2);
        })
        .end(done);
    });
  });
  describe('POST /farms', () => {
    it('should create a new farm', (done) => {
      var name = 'Test the farm name';

      request(app)
        .post('/farms')
        .send({name})
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(name);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Farm.find({name}).then((farms) => {
            expect(farms.length).toBe(1);
            expect(farms[0].name).toBe(name);
            done();
          }).catch((e) => done(e));
        });
    });

    it('should not create farm with invalid body data', (done) => {
      request(app)
        .post('/farms')
        .send({})
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Farm.find().then((farms) => {
            expect(farms.length).toBe(2);
            done();
          }).catch((e) => done(e));
        });
    });

    it('should not create farm with empty string name', (done) => {
      var name = '     ';
      request(app)
        .post('/farms')
        .send({name})
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Farm.find().then((farms) => {
            expect(farms.length).toBe(2);
            done();
          }).catch((e) => done(e));
        });
    });

    it('should not create farm with duplicate name', (done) => {
      var name = farms[0].name;
      request(app)
        .post('/farms')
        .send({name})
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Farm.find().then((farms) => {
            expect(farms.length).toBe(2);
            done();
          }).catch((e) => done(e));
        });
    });

    it('should create a new farm with trimmed white space', (done) => {
      var name = '    Another farm name       ';

      request(app)
        .post('/farms')
        .send({name})
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(name.trim());
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Farm.find({name: name.trim()}).then((farms) => {
            expect(farms.length).toBe(1);
            expect(farms[0].name).toBe('Another farm name');
            done();
          }).catch((e) => done(e));
        });
    });
  });

  describe('GET /farms/:id', () => {
    it('should return farm doc', (done) => {
      request(app)
        .get(`/farms/${farms[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.farm.name).toBe(farms[0].name);
        })
        .end(done);
    });

    it('should return 404 if farm not found', (done) => {
      var id = new ObjectID().toHexString();

      request(app)
        .get(`/farms/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
      request(app)
        .get('/farms/123')
        .expect(404)
        .end(done);
    });
  });
});

describe('*********** RAIN  ***********', () => {
  describe('GET /rain', () => {
    it('should get all rain documents', (done) => {
      request(app)
        .get('/rain')
        .expect(200)
        .expect((res) => {
          expect(res.body.rain.length).toBe(5);
        })
        .end(done);
    });
  });

  describe('POST /rain', () => {
    var date = new Date('October 10, 2017');
    it('should create a new rain document', (done) => {
      request(app)
        .post('/rain')
        .send({
          _farm: farms[0]._id,
          date: date,
          amount: 8.1,
          dimension: 'cm'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.amount).toBe(8.1);
          expect(res.body.dimension).toBe('cm');
          expect(new Date(res.body.date)).toEqual(date);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Rain.find({}).then((rain) => {
            expect(rain.length).toBe(6);
            done();
          }).catch((e) => done(e));
        });
    });
  });

  describe('GET /rain/:id', () => {
    it('should return rain doc', (done) => {
      request(app)
        .get(`/rain/${rain[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.rain.amount).toBe(1.2);
        })
        .end(done);
    });

    it('should return 404 if rain document not found', (done) => {
      var id = new ObjectID().toHexString();

      request(app)
        .get(`/rain/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
      request(app)
        .get('/rain/123')
        .expect(404)
        .end(done);
    });
  });

  describe('GET /rain/farm/:farm', () => {
    it('should return all rain documents for given farm', (done) => {
      request(app)
        .get(`/rain/farm/${farms[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.rain.length).toBe(3);
          expect(res.body.rain[0].amount).toBe(1.2);
          expect(res.body.rain[0].dimension).toBe('cm');
          expect(res.body.rain[2].amount).toBe(2.3);
          expect(res.body.rain[2].dimension).toBe('cm');
        })
        .end(done);
    });
  });
});
