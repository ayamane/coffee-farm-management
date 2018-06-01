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

  // text: {
  //   type: String,
  //   required: true,
  //   minLength: 1,
  //   trim: true
  // },
  // completed: {
  //   type: Boolean,
  //   default: false
  // },
  // completedAt: {
  //   type: Number,
  //   default: null
  // },
  // _creator: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true
  // }
});

module.exports = {Farm};
