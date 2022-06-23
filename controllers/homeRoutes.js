const path = require('path');
const router = require('express').Router();
const { User } = require('../models');
const {
  serialize,
  deSerialize,
  strategy,
  passAuth,
} = require('../config/passport-config');

router.get('/account', async (req, res) => {
  try {
    res.render('account.ejs');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    res.render('dashboard.ejs');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/register', async (req, res) => {
  try {
    res.render('register.ejs');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/game', async (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, '../client'),
  });
});

module.exports = router;
