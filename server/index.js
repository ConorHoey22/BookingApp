// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const routes = require('../routes/routes'); // Import the routes module




app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
  origin: '*',  // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}));



const PORT = process.env.PORT || 3000;

const mongoURI = 'mongodb+srv://HoeyTech:HoeyTechMongo@cluster0.ax0r64x.mongodb.net/BookingAppDatabase?retryWrites=true&w=majority';




// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    app.use('/', routes);


    // Start the Express.js server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });