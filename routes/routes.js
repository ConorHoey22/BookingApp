// routes/auth.js
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Camp = require('../models/Camp');


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
    const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{ expiresIn: '1h' });

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
      
          const { email  , password , fullName, userType} = req.body;
     
          // Check if a user with the given email already exists
          const existingUser = await User.findOne({ email });
  
          if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
          }
          // Hash the password before saving it to the database
          const hashedPassword = await bcrypt.hash(password, 10);
  
          // Save data to MongoDB
          const newUser = new User({ email, password: hashedPassword, fullName , userType });
          await newUser.save();
  
  
          res.status(200).json({ message: 'Data saved successfully' });
  
      } catch (error) {
          
          console.error('Error:', error.message);
          res.status(500).json({ error: 'Internal Server Error' });
      }
    
});


 

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) {
              return res.status(403).json("Token is invalid");
          }
          // Assign the decoded user object to req.user
          req.user = user;

          console.log(req.user);
          next();
      });
  } else {
      return res.status(403).json("You are not authenticated");
  }
};


// Define your route handler
router.get('/api/user/:userId', verifyToken, async (req, res) => {
  try {
   
    const recordId = req.user.userId; // Corrected parameter name

    // Use findById method to find a record by its ID
    const record = await User.findById(recordId);
        
    // If the record is found, you can send it in the response
    if (record) {
      res.json(record);
    } else {
      // If the record is not found, send a 404 response
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// API endpoint for Create Camp 
router.post('/api/createCamp', verifyToken, async (req, res) => {

  try {
    

        const { campName, location, price, startDate,startTime, endDate, endTime   } = req.body;
   


        //Is there a way to obtain the UserID and Ass
        const createdByUserID = req.user.userId; // Corrected parameter name

        //Camp model 

        // Save data to MongoDB
        const newCamp = new Camp({createdByUserID,campName,location, price, startDate,startTime,endDate,endTime});
        await newCamp.save();
       
      
        res.status(200).json({ message: 'Camp Data saved successfully' });

    } catch (error) {
        
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});

//GET CAMPS 
router.get('/api/camps', verifyToken, async (req, res) => {
  try {
   
    const camps = await Camp.find();
    res.status(200).json(camps);
    console.log(camps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE route to remove a camp by its ID
router.delete('/api/camps/:id',verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    await Camp.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error removing camp:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/api/updateCamp/:id', verifyToken, async (req, res) => {
  try {
      const id = req.params.id;
      const updatedCamp = req.body; // Contains updated camp data
      const result = await Camp.findByIdAndUpdate(id, updatedCamp, { new: true });

      if (!result) {
          return res.status(404).json({ message: 'Camp not found' });
      }

      res.status(200).json(result); // Return updated camp
  } catch (error) {
      console.error('Error updating camp:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;