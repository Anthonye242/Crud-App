// controllers/expenseReportController.js
const express = require('express');
const router = express.Router();
const ExpenseReport = require('../models/ExpenseReport');

// GET all expense reports
router.get('/', async (req, res) => {
  try {
    const expenseReports = await ExpenseReport.find({ user: req.session.user.id });
    res.render('expenseReports/index', { expenseReports });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET new expense report form
router.get('/new', (req, res) => {
  res.render('expenseReports/create');
});

// POST new expense report
router.post('/', async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;
    const expenseReport = new ExpenseReport({
      title,
      startDate,
      endDate,
      user: req.session.user.id
    });
    await expenseReport.save();
    res.redirect('/expense-reports');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET edit expense report form
router.get('/:id/edit', async (req, res) => {
  try {
    const expenseReport = await ExpenseReport.findOne({ _id: req.params.id, user: req.session.user.id });
    if (!expenseReport) {
      return res.status(404).send('Expense Report not found');
    }
    res.render('expenseReports/edit', { expenseReport });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT update expense report
router.put('/:id', async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;
    const expenseReport = await ExpenseReport.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      { title, startDate, endDate },
      { new: true, runValidators: true }
    );
    if (!expenseReport) {
      return res.status(404).send('Expense Report not found');
    }
    res.redirect('/expense-reports');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// DELETE expense report
router.delete('/:id', async (req, res) => {
  try {
    const expenseReport = await ExpenseReport.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
    if (!expenseReport) {
      return res.status(404).send('Expense Report not found');
    }
    res.redirect('/expense-reports');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
