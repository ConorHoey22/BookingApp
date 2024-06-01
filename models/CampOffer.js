// models/CampOffer.js

const mongoose = require('mongoose');

  // Define a Mongoose Schema for Camp Offers 
 
  const CampOfferSchema = new mongoose.Schema({
    createdByUserID:String,
    offerName: String,
    participantsRequired: String,
    percentageDiscount: String,
    reward: String,
    isActive: Boolean,
   
  });
  
  //Define Model
  const CampOffer = mongoose.model('campOffer', CampOfferSchema);
  
  module.exports = CampOffer;