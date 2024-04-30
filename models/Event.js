// models/Event.js

const mongoose = require('mongoose');

  // Define a Mongoose Schema for Users
 
  const EventSchema = new mongoose.Schema({
    createdByUserID:String,
    eventName: String,
    location: String,
    price: String,
    startDate: String,
    startTime: String,
    endTime:String
  });
  
  //Define Model
  const Event = mongoose.model('event', EventSchema);
  
  module.exports = Event;