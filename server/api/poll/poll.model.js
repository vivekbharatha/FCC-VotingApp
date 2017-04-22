'use strict';

import mongoose from 'mongoose';

var PollSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

PollSchema
  .pre('save', function(next) {
    next();
  });

// Validate email is not taken
PollSchema
  .path('email')
  .validate(function(value) {
    return this.constructor.findOne({ title: value }).exec()
      .then(poll => {
        if(poll) {
          return false;
        }
        return true;
      })
      .catch(function(err) {
        throw err;
      });
  }, 'The specified title is already in used.');

export default mongoose.model('Poll', PollSchema);
