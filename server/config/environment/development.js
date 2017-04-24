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
    TWITTER_CONSUMER_KEY: 'C9Iez14RIa3aN2UqoB3rv9gSH',
    TWITTER_CONSUMER_SECRET: 'gpBHKaZ5v2L7DGlQdGZ60hY2zfn57wLbtiVWYNpF7ahYujTmLn',
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  }

};
