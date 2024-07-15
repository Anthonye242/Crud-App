const express = require('express'); // Import the express module
const app = express(); // Create an express application
const mongoose = require('mongoose'); // Import the mongoose module for MongoDB
const methodOverride = require('method-override'); // Import method-override to support PUT and DELETE methods
const morgan = require('morgan'); // Import morgan for logging HTTP requests
const session = require('express-session'); // Import express-session for managing user sessions
const dotenv = require('dotenv'); // Import dotenv to load environment variables
const path = require('path'); // Import path module for static file serving

dotenv.config(); // Load environment variables from .env file

// Import controllers and middleware
const authController = require('./controllers/userController.js'); // Import user authentication controller
const budgetsController = require('./controllers/budgetController.js'); // Import budgets controller
const transactionsController = require('./controllers/transactionController.js'); // Import transactions controller
const expenseReportController = require('./controllers/expenseReportController.js'); // Import expense report controller
const dashboardController = require('./controllers/dashboardController.js'); // Import dashboard controller
const isSignedIn = require('./middleware/is-signed-in.js'); // Import middleware to check if user is signed in
const passUserToView = require('./middleware/pass-user-to-view.js'); // Import middleware to pass user data to views

const port = process.env.PORT || '3000'; // Set the port from environment variable or default to 3000

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`); // Log connection to MongoDB
});

// Middleware
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(methodOverride('_method')); // Override HTTP methods using query parameter _method
app.use(morgan('dev')); // Log HTTP requests with morgan
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret key for session
    resave: false, // Do not resave session if not modified
    saveUninitialized: false, // Do not save uninitialized session
  })
);

app.use(passUserToView); // Custom middleware to pass user data to views

app.set('view engine', 'ejs'); // Set EJS as the template engine

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index'); // Render the index.ejs view when accessing the root URL
});

// Middleware to check if user is signed in before accessing certain routes
app.use('/auth', authController); // Routes for authentication
app.use(isSignedIn); // Middleware to ensure user is signed in for the following routes
app.use('/dashboard', dashboardController); // Routes for dashboard
app.use('/budgets', budgetsController); // Routes for managing budgets
app.use('/transactions', transactionsController); // Routes for managing transactions
app.use('/expenseReports', expenseReportController); // Routes for managing expense reports

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`); // Start the server and log the port
});
