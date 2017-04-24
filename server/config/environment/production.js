'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP
    || process.env.ip
    || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT
    || process.env.PORT
    || 8080,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_URI
      || process.env.MONGOHQ_URL
      || process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME
      || 'mongodb://localhost/voteit'
  },
  // Twitter
  twitter: {
    TWITTER_CONSUMER_KEY: 'C9Iez14RIa3aN2UqoB3rv9gSH',
    TWITTER_CONSUMER_SECRET: 'gpBHKaZ5v2L7DGlQdGZ60hY2zfn57wLbtiVWYNpF7ahYujTmLn',
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  }
};
