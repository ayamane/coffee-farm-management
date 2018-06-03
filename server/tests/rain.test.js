const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const app = require('./../server');
const Farm = require('./../models/farm');
const Rain = require('./../models/rain');

const {rain, farms} = require('./seed/seed-data');

describe('*********** RAIN  ***********', () => {
  describe('GET /rain', () => {
    it('should get all rain documents', (done) => {
      request(app)
        .get('/rain')
        .expect(200)
        .expect((res) => {
          expect(res.body.obj.length).toBe(5);
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
        .expect(201)
        .expect((res) => {
          expect(res.body.obj.amount).toBe(8.1);
          expect(res.body.obj.dimension).toBe('cm');
          expect(new Date(res.body.obj.date)).toEqual(date);
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
          expect(res.body.obj.amount).toBe(1.2);
        })
        .end(done);
    });

    it('should return 404 if rain document not found', (done) => {
      var id = farms[0]._id.toHexString();

      request(app)
        .get(`/rain/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 500 for non-object ids', (done) => {
      request(app)
        .get('/rain/123')
        .expect(500)
        .end(done);
    });
  });

  describe('GET /rain/farm/:farm', () => {
    it('should return all rain documents for given farm', (done) => {
      request(app)
        .get(`/rain/farm/${farms[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.obj.length).toBe(3);
          expect(res.body.obj[0].amount).toBe(1.2);
          expect(res.body.obj[0].dimension).toBe('cm');
          expect(res.body.obj[2].amount).toBe(2.3);
          expect(res.body.obj[2].dimension).toBe('cm');
        })
        .end(done);
    });
  });
});
