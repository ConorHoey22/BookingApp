// models/User.js

const mongoose = require('mongoose');

  // Define a Mongoose Schema for Users
 
  const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    fullName: String,
    userType: String // Default value 'CRM'
  });
  
  //Define Model
  const User = mongoose.model('user', UserSchema);
  
  module.exports = User;