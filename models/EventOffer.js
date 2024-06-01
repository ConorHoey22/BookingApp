// models/EventOffer.js

const mongoose = require('mongoose');

  // Define a Mongoose Schema for Event Offers 
 
  const EventOfferSchema = new mongoose.Schema({
    createdByUserID:String,
    offerName: String,
    participantsRequired: String,
    percentageDiscount: String,
    reward: String,
    isActive: Boolean,
   
  });
  
  //Define Model
  const EventOffer = mongoose.model('eventOffer', EventOfferSchema);
  
  module.exports = EventOffer;