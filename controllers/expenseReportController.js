const express = require('express'); // Import the express module
const router = express.Router(); // Create a router object
const ExpenseReport = require('../models/ExpenseReport'); // Import the ExpenseReport model

// Route to get all expense reports for the signed-in user
router.get('/', async (req, res) => {
  try {
    // Find all expense reports for the signed-in user
    const expenseReports = await ExpenseReport.find({ user: req.session.user.id });
    
    // Render the expense reports index view with the fetched expense reports
    res.render('expenseReports/index', { reports: expenseReports });
  } catch (error) {
    // Send a 500 error response if there's an issue fetching the expense reports
    res.status(500).json({ error: 'EXPENSE_REPORTS_FETCH_ERROR', message: error.message });
  }
});

// Route to render the form for creating a new expense report
router.get('/new', (req, res) => {
  res.render('expenseReports/create'); // Render the expense report creation view
});

// Route to handle the submission of a new expense report
router.post('/', async (req, res) => {
  try {
    // Extract title and startDate from the request body
    const { title, startDate } = req.body;

    // Create a new expense report with the provided data
    const report = new ExpenseReport({ title, startDate, user: req.session.user.id });
    
    // Save the new expense report to the database
    await report.save();
    
    // Redirect to the expense reports index page
    res.redirect('/expenseReports');
  } catch (error) {
    // Send a 400 error response if there's an issue creating the expense report
    res.status(400).json({ error: 'EXPENSE_REPORT_CREATION_ERROR', message: error.message });
  }
});

// Route to render the form for editing an existing expense report
router.get('/:id/edit', async (req, res) => {
  try {
    // Find the expense report by ID and user ID
    const report = await ExpenseReport.findOne({ _id: req.params.id, user: req.session.user.id });
    
    // If the expense report is not found, send a 404 error response
    if (!report) {
      return res.status(404).json({ error: 'EXPENSE_REPORT_NOT_FOUND', message: 'Report not found' });
    }

    // Render the expense report edit view with the fetched report
    res.render('expenseReports/edit', { report });
  } catch (error) {
    // Send a 500 error response if there's an issue fetching the expense report
    res.status(500).json({ error: 'EXPENSE_REPORT_FETCH_ERROR', message: error.message });
  }
});

// Route to handle the update of an existing expense report
router.put('/:id', async (req, res) => {
  try {
    // Extract title and startDate from the request body
    const { title, startDate } = req.body;

    // Find the expense report by ID and user ID, and update it with the provided data
    const report = await ExpenseReport.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      { title, startDate },
      { new: true, runValidators: true }
    );

    // If the expense report is not found, send a 404 error response
    if (!report) {
      return res.status(404).json({ error: 'EXPENSE_REPORT_NOT_FOUND', message: 'Report not found' });
    }

    // Redirect to the expense reports index page
    res.redirect('/expenseReports');
  } catch (error) {
    // Send a 400 error response if there's an issue updating the expense report
    res.status(400).json({ error: 'EXPENSE_REPORT_UPDATE_ERROR', message: error.message });
  }
});

// Route to handle the deletion of an existing expense report
router.delete('/:id', async (req, res) => {
  try {
    // Find the expense report by ID and user ID, and delete it
    const report = await ExpenseReport.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });

    // If the expense report is not found, send a 404 error response
    if (!report) {
      return res.status(404).json({ error: 'EXPENSE_REPORT_NOT_FOUND', message: 'Report not found' });
    }

    // Redirect to the expense reports index page
    res.redirect('/expenseReports');
  } catch (error) {
    // Send a 500 error response if there's an issue deleting the expense report
    res.status(500).json({ error: 'EXPENSE_REPORT_DELETE_ERROR', message: error.message });
  }
});

module.exports = router; // Export the router object
