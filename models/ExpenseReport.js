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
  endDate: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const ExpenseReport = mongoose.model('ExpenseReport', expenseReportSchema);

module.exports = ExpenseReport;
