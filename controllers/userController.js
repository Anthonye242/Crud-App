const express = require('express'); // Import the express module
const router = express.Router(); // Create a router object
const bcrypt = require('bcryptjs'); // Import the bcryptjs module for password hashing
const User = require('../models/User'); // Import the User model

// Route to render the sign-up page
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up'); // Render the sign-up view
});

// Route to handle the sign-up form submission
router.post('/sign-up', async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body; // Extract the username, password, and confirmPassword from the request body

    // Check if the password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match'); // Send a 400 error response if passwords do not match
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user with the provided username and hashed password
    const user = new User({ username, password: hashedPassword });
    // Save the new user to the database
    await user.save();

    // Redirect to the sign-in page after successful sign-up
    res.redirect('/auth/sign-in');
  } catch (error) {
    // Send a 400 error response if there's an issue with sign-up
    res.status(400).send(error.message);
  }
});

// Route to render the sign-in page
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in'); // Render the sign-in view
});

// Route to handle the sign-in form submission
router.post('/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body; // Extract the username and password from the request body
    // Find the user by username
    const user = await User.findOne({ username });

    // Check if the user exists and if the password matches the hashed password in the database
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Invalid username or password'); // Send a 400 error response if username or password is invalid
    }

    // Store the user ID and username in the session
    req.session.user = { id: user._id, username: user.username };
    // Redirect to the dashboard page after successful sign-in
    res.redirect('/dashboard');
  } catch (error) {
    // Send a 400 error response if there's an issue with sign-in
    res.status(400).send(error.message);
  }
});

// Route to handle sign-out
router.get('/sign-out', (req, res) => {
  req.session.destroy(); // Destroy the user session
  res.redirect('/'); // Redirect to the home page after sign-out
});

module.exports = router; // Export the router object
