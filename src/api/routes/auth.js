const express = require('express');
const passportGithub = require('@services/auth/github');
const passportGoogle = require('@services/auth/google');
const passportAmazon = require('@services/auth/amazon');

const router = express.Router();

/**
 * Google Auth Routes
 */

router
  .route('/google/callback')
  .get(passportGoogle.authenticate('google', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/'
  }));

router
  .route('/google')
  .get(passportGoogle.authenticate('google'));


/**
 * Amazon auth routes
 */

router
 .route('/amazon/callback')
 .get(
   passportAmazon.authenticate('amazon', {
     failureRedirect: '/login'
  }),
   function(req, res) {
     // Successful authentication, redirect home.
     res.redirect('/');
  });

router.route('/amazon').get(passportAmazon.authenticate('amazon', { scope: ['profile', 'postal_code'] }));

/**
 * Github auth routes
 */

router
.route('/github/callback')
.get(
  passportGithub.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.route('/github').get(passportGithub.authenticate('github', { scope: [ 'user:email' ] }));


module.exports = router;
