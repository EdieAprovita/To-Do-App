const express = require('express');
const authRoutes = express.Router();

const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

authRoutes.post('/signup', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Provide email and password' });
    return;
  }

  if (password.length < 7) {
    res.status(400).json({
      message:
        'Please make your password at least 8 characters long for security purposes.',
    });
    return;
  }

  User.findOne({ email }, (err, foundUser) => {
    if (err) {
      res.status(500).json({ message: `${err}` });
      return;
    }

    if (foundUser) {
      res.status(400).json({ message: 'Email taken. Choose another one.' });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const aNewUser = new User({
      email: email,
      password: hashPass,
    });

    aNewUser.save((err) => {
      if (err) {
        res.status(500).json({ message: `${err}` });
        return;
      }

      req.login(aNewUser, (err) => {
        if (err) {
          res.status(500).json({ message: `${err}` });
          return;
        }

        res.status(200).json(aNewUser);
      });
    });
  });
});

authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: `${err}` });
      return;
    }

    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        res.status(500).json({ message: `${err}` });
        return;
      }

      res.status(200).json(theUser);
    });
  })(req, res, next);
});

authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ message: 'Log out success!' });
});

authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});

module.exports = authRoutes;
