const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Index - List all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.session.user.id }).sort({ date: -1 });
    res.render('transactions/index', { transactions });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// New - Show form to create a new transaction
router.get('/new', (req, res) => {
  res.render('transactions/create');
});

// Create - Handle form submission to create a new transaction
router.post('/', async (req, res) => {
  try {
    const transaction = new Transaction({ ...req.body, user: req.session.user.id });
    await transaction.save();
    res.redirect('/transactions');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Edit - Show form to edit a transaction
router.get('/:id/edit', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.session.user.id });
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }
    res.render('transactions/edit', { transaction });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update - Handle form submission to update a transaction
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }
    res.redirect('/transactions');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete - Handle deletion of a transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }
    res.redirect('/transactions');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
