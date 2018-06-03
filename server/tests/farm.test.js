const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const app = require('./../server');
const Farm = require('./../models/farm');

const {farms} = require('./seed/seed-data');

describe('*********** FARMS ***********', () => {
  describe('GET /farms', () => {
    it('should get all farms', (done) => {
      request(app)
        .get('/farms')
        .expect(200)
        .expect((res) => {
          expect(res.body.obj.length).toBe(2);
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
        .expect(201)
        .expect((res) => {
          expect(res.body.obj.name).toBe(name);
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
        .expect(500)
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
        .expect(500)
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
        .expect(500)
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
        .expect(201)
        .expect((res) => {
          expect(res.body.obj.name).toBe(name.trim());
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
          expect(res.body.obj.name).toBe(farms[0].name);
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

    it('should return 500 for non-object ids', (done) => {
      request(app)
        .get('/farms/123')
        .expect(500)
        .end(done);
    });
  });
});
