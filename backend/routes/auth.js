const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/login', (req, res, next) => {
  res.render('auth/login', { message: req.flash('error') });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true,
  })
);

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === '' || password === '') {
    res.render('auth/signup', {
      message: 'Please type your email and password',
    });
    return;
  }

  User.findOne({ email }, 'email', (error, user) => {
    if (user !== null) {
      res.render('auth/signup', { message: 'The email is already register' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      password: hashPass,
    });

    newUser
      .save()
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => {
        res.render('auth/signup', { message: `${error}` });
      });
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
