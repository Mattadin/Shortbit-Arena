const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const serialize = passport.serializeUser(function (user, done) {
  done(null, user.id);
});

const deSerialize = passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const strategy = passport.use(
  new LocalStrategy(function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        console.log(err);
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      bcrypt.compare(password, user.password, function (err, res) {
        if (err) {
          return done(err);
        }
        if (res === false) {
          return done(null, false, {
            message: 'Incorrect username or password',
          });
        }

        return done(null, user);
      });
    });
  })
);

const passAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
};

module.exports = { serialize, deSerialize, strategy, passAuth };
