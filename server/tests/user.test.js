const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const app = require('./../server');
const User = require('./../models/user');

describe('*********** USERS ***********', () => {
  describe('POST /users', () => {
    it('should create a user', (done) => {
      var firstName = 'Andrew';
      var lastName = 'Example';
      var email = 'example2@example.com';
      var password = '123mnb!';

      request(app)
        .post('/users')
        .send({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.obj._id).toBeTruthy();
          expect(res.body.obj.email).toBe(email);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          User.findOne({email}).then((user) => {
            expect(user).toBeTruthy();
            expect(user.firstName).toBe(firstName);
            expect(user.password).not.toBe(password);
            done();
          }).catch((e) => done(e));
        });
    });

    it('should return validation errors if request invalid', (done) => {
      var invalidEmail = 'abc';
      var invalidPassword = '456';

      request(app)
        .post('/users')
        .send({invalidEmail, invalidPassword})
        .expect(500)
        .expect((res) => {
          expect(res.body.title).toEqual('An error occurred');
          expect(res.body.error.name).toEqual('ValidationError');
          expect(res.body.error._message).toEqual('User validation failed');
        })
        .end(done);
    });

    it('should not create user if email in use', (done) => {
      var inUseEmail = 'andrew@example.com';
      var validPassword = '456abc!';

      request(app)
        .post('/users')
        .send({inUseEmail, validPassword})
        .expect(500)
        .expect((res) => {
          expect(res.body.title).toEqual('An error occurred');
          expect(res.body.error.name).toEqual('ValidationError');
          expect(res.body.error._message).toEqual('User validation failed');
        })
        .end(done);
    });
  });
});
