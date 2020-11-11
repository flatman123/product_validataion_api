const express = require('express');
const app = express();
const mongoose = require('mongoose');
const seedDatabase = require('./routes/api/seedDatabase');
const connectDB = require('./config/db');
const port = process.env.PORT || 3018;

// Init Middleware
app.use(express.json({extended: false}));


// Connect to Database
connectDB();
console.log(`Server is connected via port ${port}`);


// Routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/products', require('./routes/api/productsInfo'));


app.listen(port);