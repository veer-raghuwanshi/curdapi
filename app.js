const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const authRoutes = require('./routes/auth');

const app = express();
app.use(
  session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Adjust this based on your requirements
  })
);



let cors = require("cors");
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Use routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
