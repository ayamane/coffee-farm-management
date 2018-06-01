var mongoose = require('mongoose');

var Rain = mongoose.model('Rain', {
  _farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: false
  },
  dimension: {
    type: String,
    required: false
  },
  isTraceAmt: {
    type: Boolean,
    required: false
  }
});

module.exports = { Rain };
