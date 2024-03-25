// models/Camp.js

const mongoose = require('mongoose');

  // Define a Mongoose Schema for Users
 
  const BookingSchema = new mongoose.Schema({
    bookingStatus:String,
    createdByUserID: String,
    campID:String,
    email: String,
    fullName: String,
    totalPrice: String,
    participantsBooked: String,
    bookingType: String,
    participantArray: [{
      name: String,
      age: String,
      allergies: String,
      emergencyContactNumber: String,
      additionalInfo: String
    }]
  });



  
  //Define Model
  const Booking = mongoose.model('booking', BookingSchema);
  
  module.exports = Booking;