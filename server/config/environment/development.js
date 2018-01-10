'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/voteit-dev'
  },

  // Seed database on startup
  seedDB: false,

  twitter: {
    TWITTER_CONSUMER_KEY: proccess.env.TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET: proccess.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  }

};
