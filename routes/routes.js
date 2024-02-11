// routes/auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const jwt = require('jsonwebtoken');

const AsyncStorage = require('@react-native-async-storage/async-storage');

const router = express.Router();


router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the entered password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });



    // Return the token or any other relevant information
    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint for SignUp
router.post('/api/signup', async (req, res) => {

    try {
      
          const { email  , password , fullName} = req.body;
     
          // Check if a user with the given email already exists
          const existingUser = await User.findOne({ email });
  
          if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
          }
          // Hash the password before saving it to the database
          const hashedPassword = await bcrypt.hash(password, 10);
  
          // Save data to MongoDB
          const newUser = new User({ email, password: hashedPassword, fullName });
          await newUser.save();
  
  
          res.status(200).json({ message: 'Data saved successfully' });
  
      } catch (error) {
          
          console.error('Error:', error.message);
          res.status(500).json({ error: 'Internal Server Error' });
      }
    
});
  
module.exports = router;