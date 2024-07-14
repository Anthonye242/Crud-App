const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const ExpenseReport = require('../models/ExpenseReport');

router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.session.user.id }).limit(5);
    const transactions = await Transaction.find({ user: req.session.user.id }).sort({ date: -1 }).limit(5);
    const expenseReports = await ExpenseReport.find({ user: req.session.user.id }).limit(5);

    res.render('dashboard', { budgets, transactions, expenseReports });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;