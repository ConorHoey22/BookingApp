// models/Camp.js

const mongoose = require('mongoose');

  // Define a Mongoose Schema for Camps
 
  const CampSchema = new mongoose.Schema({
    createdByUserID:String,
    campName: String,
    location: String,
    price1Day: String,
    price2Day: String,
    price3Day: String,
    price4Day: String,
    price5Day: String,
    startDate: String,
    startTime: String,
    endDate:String,
    endTime:String
  });
  
  //Define Model
  const Camp = mongoose.model('camp', CampSchema);
  
  module.exports = Camp;