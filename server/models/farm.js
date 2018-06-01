var mongoose = require('mongoose');

var Farm = mongoose.model('Farm', {
  name: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
    unique: true
  },
  alias: {

  },
  tmk: {

  },
  locationNote: {

  },
  elevation: {

  },
  dimension: {

  },
  treeCount: {

  },
  size: {

  }
});

module.exports = {Farm};
