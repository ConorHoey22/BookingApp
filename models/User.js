// models/User.js

const mongoose = require('mongoose');
  
  // Define a Mongoose Schema for Users
 
  const UserSchema = new mongoose.Schema({
    email: { type: String, required: 'Please enter an email address' },
    password: { type: String, required: 'Please enter your password'},
    fullName: { type: String, required: 'Please enter your Full Name' }
  });
  
  //Define Model
  const User = mongoose.model('user', UserSchema);
  module.exports = User;