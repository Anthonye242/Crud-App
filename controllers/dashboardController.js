const express = require('express'); // Import the express module
const router = express.Router(); // Create a router object
const Budget = require('../models/Budget'); // Import the Budget model
const Transaction = require('../models/Transaction'); // Import the Transaction model
const ExpenseReport = require('../models/ExpenseReport'); // Import the ExpenseReport model

// Route to get data for the dashboard
router.get('/', async (req, res) => {
  try {
    // Find the latest 5 budgets for the signed-in user
    const budgets = await Budget.find({ user: req.session.user.id }).limit(5);
    
    // Find the latest 5 transactions for the signed-in user, sorted by date in descending order
    const transactions = await Transaction.find({ user: req.session.user.id }).sort({ date: -1 }).limit(5);
    
    // Find the latest 5 expense reports for the signed-in user
    const expenseReports = await ExpenseReport.find({ user: req.session.user.id }).limit(5);

    // Render the dashboard view with the budgets, transactions, and expense reports data
    res.render('dashboard', { budgets, transactions, expenseReports });
  } catch (error) {
    // Send a 500 error response if there's an issue fetching the data
    res.status(500).send(error.message);
  }
});

module.exports = router; // Export the router object
