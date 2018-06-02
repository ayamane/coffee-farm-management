var mongoose = require('mongoose');
var validator = require('mongoose-unique-validator');
//const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var User = mongoose.model('User', {
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true
  }/*,
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }],
  messages:
    [{
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }]
    */
});

User.schema.plugin(validator);
User.schema.virtual('username')
  .get(function() { return this.firstName.subString(0,1) + this.lastName; });

// User.schema.methods.toJSON = function() {
//   var user = this;
//   var userObject = user.toObject();
//
//   return _.pick(userObject, ['_id', 'username', 'email']);
// };
User.schema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

module.exports = User;
