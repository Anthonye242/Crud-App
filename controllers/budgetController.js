const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

// Index - List all budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.session.user.id });
    res.render('budgets/index', { budgets });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// New - Show form to create a new budget
router.get('/new', (req, res) => {
  res.render('budgets/create');
});

// Create - Handle form submission to create a new budget
router.post('/', async (req, res) => {
  try {
    const { category, limit } = req.body;
    const budget = new Budget({ category, limit, user: req.session.user.id });
    await budget.save();
    res.redirect('/budgets');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Edit - Show form to edit a budget
router.get('/:id/edit', async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.session.user.id });
    if (!budget) {
      return res.status(404).send('Budget not found');
    }
    res.render('budgets/edit', { budget });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update - Handle form submission to update a budget
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!budget) {
      return res.status(404).send('Budget not found');
    }
    res.redirect('/budgets');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete - Handle deletion of a budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
    if (!budget) {
      return res.status(404).send('Budget not found');
    }
    res.redirect('/budgets');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
