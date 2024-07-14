const express = require('express');
const router = express.Router();
const ExpenseReport = require('../models/ExpenseReport');

router.get('/', async (req, res) => {
  try {
    const expenseReports = await ExpenseReport.find({ user: req.session.user.id });
    res.render('expenseReports/index', { reports: expenseReports });
  } catch (error) {
    res.status(500).json({ error: 'EXPENSE_REPORTS_FETCH_ERROR', message: error.message });
  }
});

router.get('/new', (req, res) => {
  res.render('expenseReports/create');
});

router.post('/', async (req, res) => {
  try {
    const { title, startDate } = req.body; // Remove endDate from here
    const report = new ExpenseReport({ title, startDate, user: req.session.user.id }); // Remove endDate from here
    await report.save();
    res.redirect('/expenseReports');
  } catch (error) {
    res.status(400).json({ error: 'EXPENSE_REPORT_CREATION_ERROR', message: error.message });
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const report = await ExpenseReport.findOne({ _id: req.params.id, user: req.session.user.id });
    if (!report) {
      return res.status(404).json({ error: 'EXPENSE_REPORT_NOT_FOUND', message: 'Report not found' });
    }
    res.render('expenseReports/edit', { report });
  } catch (error) {
    res.status(500).json({ error: 'EXPENSE_REPORT_FETCH_ERROR', message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, startDate } = req.body; // Remove endDate from here
    const report = await ExpenseReport.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      { title, startDate }, // Remove endDate from here
      { new: true, runValidators: true }
    );
    if (!report) {
      return res.status(404).json({ error: 'EXPENSE_REPORT_NOT_FOUND', message: 'Report not found' });
    }
    res.redirect('/expenseReports');
  } catch (error) {
    res.status(400).json({ error: 'EXPENSE_REPORT_UPDATE_ERROR', message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const report = await ExpenseReport.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
    if (!report) {
      return res.status(404).json({ error: 'EXPENSE_REPORT_NOT_FOUND', message: 'Report not found' });
    }
    res.redirect('/expenseReports');
  } catch (error) {
    res.status(500).json({ error: 'EXPENSE_REPORT_DELETE_ERROR', message: error.message });
  }
});

module.exports = router;
