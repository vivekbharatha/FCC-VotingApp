/**
 * Created by vivek on 24/04/17.
 */
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as TwitterStrategy} from 'passport-twitter';

export function setup(User, config) {
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.TWITTER_CONSUMER_KEY,
    consumerSecret: config.twitter.TWITTER_CONSUMER_SECRET,
    callbackURL: config.twitter.callbackURL
  },function(token, tokenSecret, profile, cb) {

    User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
      if (err)
        return cb(err);

      // if the user is found then log them in
      if (user) {
        return cb(null, user); // user found, return that user
      } else {
        // if there is no user, create them
        var newUser                 = new User();

        // set all of the user data that we need
        newUser.twitter.id          = profile.id;
        newUser.twitter.token       = token;
        newUser.twitter.username    = profile.username;
        newUser.twitter.displayName = profile.displayName;

        // save our user into the database
        newUser.save(function(err) {
          if (err)
            throw err;
          return cb(null, newUser);
        });
      }
    });
    }
  ));
}
