// models/Camp.js

const mongoose = require('mongoose');

  // Define a Mongoose Schema for Bookings
 
  const BookingSchema = new mongoose.Schema({
    bookingStatus: String,
    bookingName: String,
    createdByUserID: String,
    campID:String,
    eventID:String,
    email: String,
    fullName: String,
    price: Number,
    participantsBooked: String,
    bookingType: String,
    discount: [String],
    reward: [String],
    participantArray: [{
      name: String,
      age: String,
      allergies: String,
      emergencyContactNumber: String,
      additionalInfo: String,
      attendanceStatus: String,
      reasonForRefund: String,
      totalParticipantPrice: Number,
      daysSelectedArray:[String]

    }]
  });



  
  //Define Model
  const Booking = mongoose.model('booking', BookingSchema);
  
  module.exports = Booking;