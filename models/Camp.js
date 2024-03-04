// models/Camp.js

const mongoose = require('mongoose');

  // Define a Mongoose Schema for Users
 
  const CampSchema = new mongoose.Schema({
    createdByUserID:String,
    campName: String,
    location: String,
    price: String,
    startDate: String,
    startTime: String,
    endDate:String,
    endTime:String
  });
  
  //Define Model
  const Camp = mongoose.model('camp', CampSchema);
  
  module.exports = Camp;