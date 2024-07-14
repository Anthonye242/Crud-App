const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.session.user.id }).sort({ date: -1 });
    res.render('transactions/index', { transactions });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/new', (req, res) => {
  res.render('transactions/create');
});

router.post('/', async (req, res) => {
  try {
    const transaction = new Transaction({ ...req.body, user: req.session.user.id });
    await transaction.save();
    res.redirect('/transactions');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

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