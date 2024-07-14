const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');

router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.session.user.id });
    res.render('budgets/index', { budgets });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/new', (req, res) => {
  res.render('budgets/create');
});

router.post('/', async (req, res) => {
  try {
    const { title, amount } = req.body;
    const budget = new Budget({ title, amount, user: req.session.user.id });
    await budget.save();
    res.redirect('/budgets');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

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