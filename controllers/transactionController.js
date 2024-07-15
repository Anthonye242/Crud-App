const express = require('express'); // Import the express module
const router = express.Router(); // Create a router object
const Transaction = require('../models/Transaction'); // Import the Transaction model

// Route to get all transactions for the signed-in user
router.get('/', async (req, res) => {
  try {
    // Find all transactions for the signed-in user, sorted by date in descending order
    const transactions = await Transaction.find({ user: req.session.user.id }).sort({ date: -1 });
    
    // Render the transactions index view with the fetched transactions
    res.render('transactions/index', { transactions });
  } catch (error) {
    // Send a 500 error response if there's an issue fetching the transactions
    res.status(500).send(error.message);
  }
});

// Route to render the form for creating a new transaction
router.get('/new', (req, res) => {
  res.render('transactions/create'); // Render the transaction creation view
});

// Route to handle the submission of a new transaction
router.post('/', async (req, res) => {
  try {
    // Create a new transaction with the provided data and the signed-in user's ID
    const transaction = new Transaction({ ...req.body, user: req.session.user.id });
    
    // Save the new transaction to the database
    await transaction.save();
    
    // Redirect to the transactions index page
    res.redirect('/transactions');
  } catch (error) {
    // Send a 400 error response if there's an issue creating the transaction
    res.status(400).send(error.message);
  }
});

// Route to render the form for editing an existing transaction
router.get('/:id/edit', async (req, res) => {
  try {
    // Find the transaction by ID and user ID
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.session.user.id });
    
    // If the transaction is not found, send a 404 error response
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }

    // Render the transaction edit view with the fetched transaction
    res.render('transactions/edit', { transaction });
  } catch (error) {
    // Send a 500 error response if there's an issue fetching the transaction
    res.status(500).send(error.message);
  }
});

// Route to handle the update of an existing transaction
router.put('/:id', async (req, res) => {
  try {
    // Find the transaction by ID and user ID, and update it with the provided data
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    // If the transaction is not found, send a 404 error response
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }

    // Redirect to the transactions index page
    res.redirect('/transactions');
  } catch (error) {
    // Send a 400 error response if there's an issue updating the transaction
    res.status(400).send(error.message);
  }
});

// Route to handle the deletion of an existing transaction
router.delete('/:id', async (req, res) => {
  try {
    // Find the transaction by ID and user ID, and delete it
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });

    // If the transaction is not found, send a 404 error response
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }

    // Redirect to the transactions index page
    res.redirect('/transactions');
  } catch (error) {
    // Send a 500 error response if there's an issue deleting the transaction
    res.status(500).send(error.message);
  }
});

module.exports = router; // Export the router object
