'use strict';

import express from 'express';
import passport from 'passport';
import {signToken} from '../auth.service';

var router = express.Router();

router.post('/', function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', false);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
}, passport.authenticate('twitter'));

router.get('/callback',
  passport.authenticate('twitter', { failureRedirect: '/login'}),
function (req, res) {
  console.log(req.user);
});

export default router;
