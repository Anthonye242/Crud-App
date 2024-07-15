const express = require('express'); // Import the express module
const router = express.Router(); // Create a router object
const Budget = require('../models/Budget'); // Import the Budget model

// Route to get all budgets for the signed-in user
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.session.user.id }); // Find budgets associated with the user
    res.render('budgets/index', { budgets }); // Render the budgets/index view with the budgets data
  } catch (error) {
    res.status(500).json({ error: 'BUDGETS_FETCH_ERROR', message: error.message }); // Send error response if there's an issue fetching budgets
  }
});

// Route to display the form to create a new budget
router.get('/new', (req, res) => {
  res.render('budgets/create'); // Render the budgets/create view
});

// Route to handle the creation of a new budget
router.post('/', async (req, res) => {
  try {
    const { title, amount } = req.body; // Destructure title and amount from the request body
    const budget = new Budget({ title, amount, user: req.session.user.id }); // Create a new Budget instance
    await budget.save(); // Save the budget to the database
    res.redirect('/budgets'); // Redirect to the budgets page
  } catch (error) {
    res.status(400).json({ error: 'BUDGET_CREATION_ERROR', message: error.message }); // Send error response if there's an issue creating the budget
  }
});

// Route to display the form to edit an existing budget
router.get('/:id/edit', async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.session.user.id }); // Find the budget by ID and user
    if (!budget) {
      return res.status(404).json({ error: 'BUDGET_NOT_FOUND', message: 'Budget not found' }); // Send error response if budget not found
    }
    res.render('budgets/edit', { budget }); // Render the budgets/edit view with the budget data
  } catch (error) {
    res.status(500).json({ error: 'BUDGET_FETCH_ERROR', message: error.message }); // Send error response if there's an issue fetching the budget
  }
});

// Route to handle the updating of an existing budget
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id }, // Find the budget by ID and user
      req.body, // Update the budget with the data from the request body
      { new: true, runValidators: true } // Return the updated budget and run validators
    );
    if (!budget) {
      return res.status(404).json({ error: 'BUDGET_NOT_FOUND', message: 'Budget not found' }); // Send error response if budget not found
    }
    res.redirect('/budgets'); // Redirect to the budgets page
  } catch (error) {
    res.status(400).json({ error: 'BUDGET_UPDATE_ERROR', message: error.message }); // Send error response if there's an issue updating the budget
  }
});

// Route to handle the deletion of a budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.session.user.id }); // Find and delete the budget by ID and user
    if (!budget) {
      return res.status(404).json({ error: 'BUDGET_NOT_FOUND', message: 'Budget not found' }); // Send error response if budget not found
    }
    res.redirect('/budgets'); // Redirect to the budgets page
  } catch (error) {
    res.status(500).json({ error: 'BUDGET_DELETE_ERROR', message: error.message }); // Send error response if there's an issue deleting the budget
  }
});

module.exports = router; // Export the router object
