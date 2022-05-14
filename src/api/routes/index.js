const express = require('express');
const router = express.Router({ strict: true });

const authRoutes = require('./auth');
const userRoutes = require('./user');
const { ensureAuthenticated } = require('@middleware/ensureAuthenticated');

// Authentication routes
router.use('/auth', authRoutes);

// User related protected routes
router.use('/user', ensureAuthenticated, userRoutes);

/**
 * Login and Logout routes are outside the auth routes module
 * Purely a personal preference, can be put inside auth routes module
 */
router
  .route('/login')
  .get((req, res) => res.render('login'));

router
  .route('/logout')
  .get(function(req, res, next) {
    req.session.destroy(function(err) {
      if(err) return res.redirect('/');
      res.clearCookie('sid');
      res.redirect('/login');
    });
  });


module.exports = router;