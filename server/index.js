// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt')



app.use(bodyParser.json());
app.use(express.json());





app.use(cors());
const PORT = process.env.PORT || 3000;

const mongoURI = 'mongodb+srv://HoeyTech:HoeyTechMongo@cluster0.ax0r64x.mongodb.net/BookingAppDatabase?retryWrites=true&w=majority';



// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
  


    // Define a Mongoose Schema for User Booking 
 
    const UserSchema = new mongoose.Schema({
      email: { type: String, required: 'Please enter an email address' },
      password: { type: String, required: 'Please enter your password'},
      fullName: { type: String, required: 'Please enter your Full Name' }
    });
    
    //Define Model
    const User = mongoose.model('User', UserSchema);
    




// API endpoint for saving data
app.post('/api/signup', async (req, res) => {

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

    // Start the Express.js server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });