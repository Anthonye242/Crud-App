// server.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const authController = require('./controllers/userController.js');
const budgetsController = require('./controllers/budgetController.js');
const transactionsController = require('./controllers/transactionController.js');
const expenseReportsController = require('./controllers/expenseReportController.js');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const port = process.env.PORT || '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passUserToView);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/auth', authController);
app.use(isSignedIn);
app.use('/budgets', budgetsController);
app.use('/transactions', transactionsController);
app.use('/expense-reports', expenseReportsController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
