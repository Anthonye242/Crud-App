const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Sign-up routes
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up');
});

router.post('/sign-up', async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.redirect('/auth/sign-in');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Sign-in routes
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in');
});

router.post('/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Invalid username or password');
    }

    req.session.user = { id: user._id, username: user.username };
    res.redirect('/');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Sign-out route
router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
