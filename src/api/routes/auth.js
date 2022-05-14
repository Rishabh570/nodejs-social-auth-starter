const express = require('express');
const passportGithubCrossSync = require('@services/auth/github-cross-sync');
const passportGoogleCrossSync = require('@services/auth/google-cross-sync');
const passportAmazonCrossSync = require('@services/auth/amazon-cross-sync');
const { disconnectGoogle, disconnectAmazon, disconnectGithub } = require('../../services/user');

const router = express.Router();

/**
 * Google Auth Routes
 */

router.get('/google/disconnect', async (req, res) => {
  if(req.user.connectedSocialAccounts > 1) {
    await disconnectGoogle(req.user);
  }
  res.redirect('/');
});

router
  .route('/google/callback')
  .get(passportGoogleCrossSync.authenticate('google', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/'
  }));

router
  .route('/google')
  .get(passportGoogleCrossSync.authenticate('google'));


/**
 * Amazon auth routes
 */

router.get('/amazon/disconnect', async (req, res) => {
  if(req.user.connectedSocialAccounts > 1) {
    await disconnectAmazon(req.user);
  }
  res.redirect('/');
});

router
 .route('/amazon/callback')
 .get(
   passportAmazonCrossSync.authenticate('amazon', { failureRedirect: '/login' }),
   function(req, res) {
     // Successful authentication, redirect home.
     res.redirect('/');
   });

router.route('/amazon').get(passportAmazonCrossSync.authenticate('amazon', { scope: ['profile', 'postal_code'] }));

/**
 * Github auth routes
 */

router.get('/github/disconnect', async (req, res) => {
  if(req.user.connectedSocialAccounts > 1) {
    await disconnectGithub(req.user);
  }
  res.redirect('/');
});

router
.route('/github/callback')
.get(
  passportGithubCrossSync.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


router.route('/github').get(passportGithubCrossSync.authenticate('github', { scope: [ 'user:email' ] }));


module.exports = router;
