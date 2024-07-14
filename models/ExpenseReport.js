// models/ExpenseReport.js
const mongoose = require('mongoose');

const expenseReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('ExpenseReport', expenseReportSchema);
