const path = require('path');
const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/account', async (req, res) => {
  try {
    res.sendFile('account.html', { root: path.join(__dirname, '../views') });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    res.sendFile('dashboard.html', { root: path.join(__dirname, '../views') });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/signup', async (req, res) => {
  try {
    res.sendFile('register.html', { root: path.join(__dirname, '../views') });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/game', withAuth, async (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, '../client'),
  });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/dashboard');
    return;
  }

  res.sendFile('account.html', {
    root: path.join(__dirname, '../views'),
  });
});

module.exports = router;
