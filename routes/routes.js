// routes - API 
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Camp = require('../models/Camp');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const CampOffer = require('../models/CampOffer');
const EventOffer = require('../models/EventOffer');

const jwt = require('jsonwebtoken');

const AsyncStorage = require('@react-native-async-storage/async-storage');


const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);









const nodemailer = require('nodemailer');



router.post('/api/sendResetPasswordCode', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

      // Generate a random reset token (6-digit code)
      const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

      await user.save();




       // Create a transporter using the App Password from your Gmail account
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'conorhoey133@gmail.com', // Your Gmail address
          pass: 'yzyn ogxw eejb flof',    // Your App Password (replace with the generated App Password)
        },
      });

      // Set up email data (who the email is sent to, subject, etc.)
      const mailOptions = {
        from: 'conorhoey133@gmail.com',        // Sender address
        to: email,  // List of recipients
        subject: 'Password Reset Request - Booking System',      // Subject line
        text: `Your password reset token is: ${resetToken}`,
      };

      // Send the email using the transporter
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email: ', error);
        } else {
          console.log('Email sent successfully: ' + info.response);
        }
      });


});

router.post('/api/verifyResetToken', async (req, res) => {
 
  const { enteredResetPasswordCode , newPassword } = req.body;

  const user = await User.findOne({ resetToken: enteredResetPasswordCode });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and clear the token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: 'Code is correct' });

});



router.put('/api/resetPassword', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ resetToken: enteredResetPasswordCode });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

});


router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the entered password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{ expiresIn: '1h' });

    // Return the token or any other relevant information
    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
  
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint for SignUp
router.post('/api/signup', async (req, res) => {

    try {
      
          const { email  , password , fullName, userType, agreeToTCs} = req.body;
     
          // Check if a user with the given email already exists
          const existingUser = await User.findOne({ email });
  
          if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
          }
          // Hash the password before saving it to the database
          const hashedPassword = await bcrypt.hash(password, 10);


          console.log(agreeToTCs);
          // Save data to MongoDB
          const newUser = new User({ email, password: hashedPassword, fullName , userType, agreeToTCs });
          await newUser.save();
  
  
          res.status(200).json({ message: 'Data saved successfully' });
  
      } catch (error) {
          
          console.error('Error:', error.message);
          res.status(500).json({ error: 'Internal Server Error' });
      }
    
});


 

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) {
              return res.status(403).json("Token is invalid");
          }
          // Assign the decoded user object to req.user
          req.user = user;

          console.log(req.user);
          next();
      });
  } else {
      return res.status(403).json("You are not authenticated");
  }
};


// Define your route handler
router.get('/api/user/:userId', verifyToken, async (req, res) => {
  try {
   
    const recordId = req.user.userId; // Corrected parameter name

    // Use findById method to find a record by its ID
    const record = await User.findById(recordId);
        
    // If the record is found, you can send it in the response
    if (record) {
      res.json(record);
    } else {
      // If the record is not found, send a 404 response
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// API endpoint for Create Event 
router.post('/api/createEvent', verifyToken, async (req, res) => {

  try {
    

        const { eventName, location, price, startDate,startTime, endTime } = req.body;
   


        //Is there a way to obtain the UserID 
        const createdByUserID = req.user.userId; // Corrected parameter name

        //Event model 

        // Save data to MongoDB
        const newEvent = new Event({createdByUserID,eventName,location, price,startDate,startTime,endTime});
        await newEvent.save();
       
      
        res.status(200).json({ message: 'Event Data saved successfully' });

    } catch (error) {
        
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});


// API endpoint for Create Event 
router.post('/api/createEventAndroid', verifyToken, async (req, res) => {

  try {
    

        const { eventName, location, price, startDate,startTime, endTime } = req.body;
   


        //Is there a way to obtain the UserID 
        const createdByUserID = req.user.userId; // Corrected parameter name

        //Event model 

        // Save data to MongoDB
        const newEvent = new Event({createdByUserID,eventName,location, price,startDate,startTime,endTime});
        await newEvent.save();
       
      
        res.status(200).json({ message: 'Event Data saved successfully' });

    } catch (error) {
        
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});

//GET EVENTS 
router.get('/api/events', verifyToken, async (req, res) => {
  try {
   
    const events = await Event.find();
    res.status(200).json(events);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// API endpoint for Create Event Offer
router.post('/api/createEventOffer', verifyToken, async (req, res) => {

  try {
    

        const { offerName, participantsRequired, percentageDiscount, reward } = req.body;
   
        //Is there a way to obtain the UserID 
        const createdByUserID = req.user.userId; // Corrected parameter name

        //Event model 

        // Save data to MongoDB
        const newEventOffer = new EventOffer({createdByUserID,offerName, participantsRequired, percentageDiscount, reward, isActive:false});
        await newEventOffer.save();
       
      
        res.status(200).json({ message: 'Event Offer Data saved successfully' });

    } catch (error) {
        
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});



//GET Evemt offers 
router.get('/api/getEventOffers', verifyToken, async (req, res) => {
  try {
   
    const eventOffer = await EventOffer.find();
    res.status(200).json(eventOffer);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Event
router.put('/api/updateEvent/:id', verifyToken, async (req, res) => {
  try {
      const id = req.params.id;
      const updatedEvent = req.body; // Contains updated camp data
      const result = await Event.findByIdAndUpdate(id, updatedEvent, { new: true });

      if (!result) {
          return res.status(404).json({ message: 'Camp not found' });
      }

      res.status(200).json(result); // Return updated camp
  } catch (error) {

      res.status(500).json({ message: 'Server error' });
  }
});


// Update Event Android
router.put('/api/updateEventAndroid/:id', verifyToken, async (req, res) => {
  try {
      const id = req.params.id;
      const updatedEvent = req.body; // Contains updated event data
      const result = await Event.findByIdAndUpdate(id, updatedEvent, { new: true });

      if (!result) {
          return res.status(404).json({ message: 'Event not found' });
      }

      res.status(200).json(result); // Return updated event
  } catch (error) {

      res.status(500).json({ message: 'Server error' });
  }
});







// API endpoint for Activate Event Offer
router.put('/api/ActivateEventOffer/:id', verifyToken, async (req, res) => {

  try {
    
    const receivedEventOfferID = req.params.id; // Access the ID from request params


        // Updare data to MongoDB
        const result = await EventOffer.findOneAndUpdate(
          { 
            _id: receivedEventOfferID,
          },
          { 
            $set: { 
          
              isActive: true, // Update booking status
            }
          },
          { new: true }
        );
     
           // Update Event Offer record
           res.status(200).json({ message: 'Event Offer Data updated successfully' });

    } catch (error) {
        
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});


// API endpoint for Deactivate Event Offer
router.put('/api/DeactivateEventOffer/:id', verifyToken, async (req, res) => {

  try {
    
    const receivedEventOfferID = req.params.id; // Access the ID from request params


        // Updare data to MongoDB
        const result = await EventOffer.findOneAndUpdate(
          { 
            _id: receivedEventOfferID,
          },
          { 
            $set: { 
          
              isActive: false, // Update booking status
            }
          },
          { new: true }
        );
     
           // Update Event Offer record
           res.status(200).json({ message: 'Event Offer Data updated successfully' });

    } catch (error) {
        
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});







// API endpoint for Create Camp Offer
router.post('/api/createCampOffer', verifyToken, async (req, res) => {

  try {
    

        let { offerName, participantsRequired, percentageDiscount, reward } = req.body;
   
        //Is there a way to obtain the UserID 
        const createdByUserID = req.user.userId; // Corrected parameter name

        //Camp model 


        //null check reward / discount 
        if(reward == "")
        {
          // Save data to MongoDB
          const newCampOffer = new CampOffer({createdByUserID,offerName, participantsRequired, percentageDiscount, isActive: false});
          await newCampOffer.save();
        }
        else if(percentageDiscount == "")
        {
          // Save data to MongoDB
          const newCampOffer = new CampOffer({createdByUserID,offerName, participantsRequired, reward, isActive: false});
          await newCampOffer.save();
        }
        else{

          // Save data to MongoDB
          const newCampOffer = new CampOffer({createdByUserID,offerName, participantsRequired, percentageDiscount, reward, isActive: false});
          await newCampOffer.save();
        }
   
        res.status(200).json({ message: 'Camp Offer Data saved successfully' });

    } catch (error) {
        
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});

//GET Camp offers 
router.get('/api/getCampOffers', verifyToken, async (req, res) => {
  try {
   
    const campOffers = await CampOffer.find();
    res.status(200).json(campOffers);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// API endpoint for Activate Camp Offer
router.put('/api/ActivateCampOffer/:id', verifyToken, async (req, res) => {

  try {
    
    const receivedCampOfferID = req.params.id; // Access the ID from request params


        // Updare data to MongoDB
        const result = await CampOffer.findOneAndUpdate(
          { 
            _id: receivedCampOfferID,
          },
          { 
            $set: { 
          
              isActive: true, // Update booking status
            }
          },
          { new: true }
        );
     
           // Update Camp Offer record
           res.status(200).json({ message: 'Camp Offer Data updated successfully' });

    } catch (error) {
        
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});


// API endpoint for Deactivate Camp Offer
router.put('/api/DeactivateCampOffer/:id', verifyToken, async (req, res) => {

  try {
    
    const receivedCampOfferID = req.params.id; // Access the ID from request params


        // Updare data to MongoDB
        const result = await CampOffer.findOneAndUpdate(
          { 
            _id: receivedCampOfferID,
          },
          { 
            $set: { 
          
              isActive: false, // Update booking status
            }
          },
          { new: true }
        );
     
           // Update Camp Offer record
           res.status(200).json({ message: 'Camp Offer Data updated successfully' });

    } catch (error) {
        
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});






// API endpoint for Create Camp Android
router.post('/api/createCamp', verifyToken, async (req, res) => {

  try {
    

        const { campName, location, price1Day, price2Day, price3Day, price4Day, price5Day,startDate,startTime, endDate, endTime   } = req.body;
   


        //Is there a way to obtain the UserID 
        const createdByUserID = req.user.userId; // Corrected parameter name

        //Camp model 

        // Save data to MongoDB
        const newCamp = new Camp({createdByUserID,campName,location, price1Day,price2Day,price3Day,price4Day,price5Day,startDate,startTime,endDate,endTime});
        await newCamp.save();
       
      
        res.status(200).json({ message: 'Camp Data saved successfully' });

    } catch (error) {
        
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});



// API endpoint for Create Camp iOS
router.post('/api/createCampIOS', verifyToken, async (req, res) => {

  try {
    

        const { campName, location, price1Day, price2Day, price3Day, price4Day, price5Day,startIOSDate,startIOSTime, endIOSDate, endIOSTime} = req.body;
   


        //Is there a way to obtain the UserID 
        const createdByUserID = req.user.userId; // Corrected parameter name

        //Camp model 

        // Save data to MongoDB
        const newCamp = new Camp({createdByUserID,campName,location, price1Day,price2Day,price3Day,price4Day,price5Day,startDate: startIOSDate,startTime: startIOSTime, endDate: endIOSDate, endTime: endIOSTime});
        await newCamp.save();
       
      
        res.status(200).json({ message: 'Camp Data saved successfully' });

    } catch (error) {
        
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});



//GET CAMPS 
router.get('/api/camps', verifyToken, async (req, res) => {
  try {
   
    const camps = await Camp.find();
    res.status(200).json(camps);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// DELETE route to remove a camp by its ID
router.delete('/api/camps/:id',verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    await Camp.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {

    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE route to remove a camp by its ID
router.delete('/api/events/:id',verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    await Event.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {

    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE route to remove a campOffer by its ID
router.delete('/api/campOffers/:id',verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    await CampOffer.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {

    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE route to remove a eventOffer by its ID
router.delete('/api/eventOffers/:id',verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    await EventOffer.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {

    res.status(500).json({ error: 'Internal server error' });
  }
});



router.put('/api/updateCamp/:id', verifyToken, async (req, res) => {
  try {
      const id = req.params.id;
      const updatedCamp = req.body; // Contains updated camp data
      const result = await Camp.findByIdAndUpdate(id, updatedCamp, { new: true });

      if (!result) {
          return res.status(404).json({ message: 'Camp not found' });
      }

      res.status(200).json(result); // Return updated camp
  } catch (error) {

      res.status(500).json({ message: 'Server error' });
  }
});

router.put('/api/updateCampAndroid/:id', verifyToken, async (req, res) => {
  try {
      const id = req.params.id;
      const updatedCamp = req.body; // Contains updated camp data
      const result = await Camp.findByIdAndUpdate(id, updatedCamp, { new: true });

      if (!result) {
          return res.status(404).json({ message: 'Camp not found' });
      }

      res.status(200).json(result); // Return updated camp
  } catch (error) {

      res.status(500).json({ message: 'Server error' });
  }
});



// Stripe API Requests 

router.post('/api/campPayment', verifyToken ,async (req, res) => {
  try {
    // Getting data from client
    let { amount, bookingName , email , fullname } = req.body;
    // Simple validation
    if (!amount || !bookingName)
      return res.status(400).json({ message: "All fields are required" });
      const amountInPence = Math.round(amount * 100);


      // Initiate payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPence,
        currency: "GBP",
        payment_method_types: ["card"],
        metadata: { bookingName , email , fullname},
      });

      // Extracting the client secret 
      const clientSecret = paymentIntent.client_secret;
      // Sending the client secret as response
      res.json({ message: "Payment initiated", clientSecret });
 
  } catch (err) {
    // Catch any error and send error 500 to client

    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.post('/api/eventPayment', verifyToken ,async (req, res) => {
  try {
    // Getting data from client
    let { amount, bookingName , email , fullname } = req.body;
    // Simple validation
    if (!amount || !bookingName)
      return res.status(400).json({ message: "All fields are required" });
      const amountInPence = Math.round(amount * 100);


      // Initiate payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPence,
        currency: "GBP",
        payment_method_types: ["card"],
        metadata: { bookingName , email , fullname},
      });

      // Extracting the client secret 
      const clientSecret = paymentIntent.client_secret;
      // Sending the client secret as response
      res.json({ message: "Payment initiated", clientSecret });
 
  } catch (err) {
    // Catch any error and send error 500 to client

    res.status(500).json({ message: "Internal Server Error" });
  }
});

  
// Create Event Booking Record
router.post('/api/createBookingEventRecord', verifyToken, async (req, res) => {

  try {
    

    const { email, bookingName , fullName , location , eventName , price , participantsBooked  , eventID , participantArray , discount , reward} = req.body;
        
        // What camp is this they booked for ,. need the Camp ID 
        //Is there a way to obtain the UserID and Ass
        const createdByUserID = req.user.userId; 


        // Save data to MongoDB
        const newEventBooking = new Booking({bookingStatus: 'Booked' , createdByUserID, bookingName:bookingName,eventID: eventID, email, fullName , price ,eventID, participantsBooked, bookingType: 'Event' ,  participantArray: participantArray, discount, reward });
       
        await newEventBooking.save();


      
        res.status(200).json({ message: 'Event Booking Record Data saved successfully' });

    } catch (error) {

        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});
    
// Create Camp Booking Record
router.post('/api/createBookingCampRecord', verifyToken, async (req, res) => {

  try {
    

        const { email, bookingName , fullName , location , eventName , price , participantsBooked  , campID , participantArray , discount , reward} = req.body;
        
        // What camp is this they booked for ,. need the Camp ID 
        //Is there a way to obtain the UserID and Ass
        const createdByUserID = req.user.userId; 
    
        // Save data to DB
        const newCampBooking = new Booking({bookingStatus: 'Booked' , campID: campID, createdByUserID, email, bookingName: bookingName , price ,campID, participantsBooked, bookingType: 'Camp' ,  participantArray: participantArray, discount, reward });
       
        await newCampBooking.save();
      
        res.status(200).json({ message: 'Camp Booking Record Data saved successfully' });

    } catch (error) {

        res.status(500).json({ error: 'Internal Server Error' });
    }
  
});


// Get Booking Records assinged to User 
router.get('/api/getBookingRecords', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming the userId is passed as a parameter

    // Find bookings where createdBy === userId && CampType  == Camp 
    const existingBookings = await Booking.find({ createdByUserID: userId });

    if (existingBookings.length > 0) {
      // If there are existing bookings for the user, return them
      return res.status(200).json(existingBookings);
    } else {
      // If there are no bookings for the user, return an appropriate message
      return res.status(404).json({ message: 'No bookings found for this user' });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Camp Booking Records assigned to User 
router.get('/api/getBookingCampRecords', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming the userId is passed as a parameter

    // Find bookings where createdBy === userId && CampType  == Camp 
    const existingBookings = await Booking.find({ createdByUserID: userId });

    if (existingBookings.length > 0) {
      // If there are existing bookings for the user, return them
      return res.status(200).json(existingBookings);
    } else {
      // If there are no bookings for the user, return an appropriate message
      return res.status(404).json({ message: 'No bookings found for this user' });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//Partial Refund Request
router.put('/api/updateBookingRecord/:id', verifyToken, async (req, res) => {
 try {
    
      const receivedBookingID = req.params.id; // Access the ID from request params



    //Participants Selected 
      const participantsSelected = req.body.participantID;
      
   
      const reasonForRefund = req.body.reasonForRefund;

      const updateBookingStatus = 'Requested Partial Refund'

    const result = await Booking.findOneAndUpdate(
      { 
        _id: receivedBookingID, 
        'participantArray._id': { $in: participantsSelected } // Filter by booking ID and multiple participant IDs
      },
      { 
        $set: { 
          'participantArray.$[elem].reasonForRefund': reasonForRefund,
          'participantArray.$[elem].attendanceStatus': updateBookingStatus,
          bookingStatus: updateBookingStatus,
        }
      },
      { 
        new: true,
        arrayFilters: [{ 'elem._id': { $in: participantsSelected } }] // Array filters to match the participant IDs
      }
    );

      // Update participant record 
       res.status(200).json(result); // Return updated camp

      
   } catch (error) {
            console.error('Error updating Booking:', error);
            res.status(500).json({ message: 'Server error' });
   }

});

//Full Refund Request
router.put('/api/fullRefundRequest/:id', verifyToken, async (req, res) => {
  try {
     console.log("kk");
       const receivedBookingID = req.params.id; // Access the ID from request params
 
       const reasonForRefund = req.body.reasonForRefund;
 
       const updateBookingStatus = 'Requested Full Refund'
 
     const result = await Booking.findOneAndUpdate(
      { 
        _id: receivedBookingID,
      },
      { 
        $set: { 
          'participantArray.$[].reasonForRefund': reasonForRefund, // Set reason for refund for all participants
          'participantArray.$[].attendanceStatus': updateBookingStatus, // Set attendance status for all participants
          bookingStatus: updateBookingStatus, // Update booking status
        }
      },
      { new: true }
    );
 
       // Update participant record 
        res.status(200).json(result); // Return updated camp
 
       
    } catch (error) {
             console.error('Error updating Booking:', error);
             res.status(500).json({ message: 'Server error' });
    }
 
 });
   

// Get Event Booking Records assigned to User 
router.get('/api/getBookingEventRecords', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming the userId is passed as a parameter

    // Find bookings where createdBy === userId && CampType  == Camp 
    const existingBookings = await Booking.find({ createdByUserID: userId , bookingType: "Event" });

    if (existingBookings.length > 0) {
      // If there are existing bookings for the user, return them
      return res.status(200).json(existingBookings);
    } else {
      // If there are no bookings for the user, return an appropriate message
      return res.status(404).json({ message: 'No bookings found for this user' });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



// Get Camp Booking Records assigned to User 
router.get('/api/getCampAttendance/:id', verifyToken, async (req, res) => {
  try {

    const campID = req.params.id; // Extract the camp ID from the URL parameter

    // Find bookings where createdBy === userId && CampType  == Camp 
    const existingBookings = await Booking.find({ campID: campID, bookingType:'Camp' });

     // Send the existing bookings in the response
     res.json(existingBookings);
  
    } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});




// Get Event Booking Records assigned to User 
router.get('/api/getEventAttendance/:id', verifyToken, async (req, res) => {
  try {

    const eventID = req.params.id; // Extract the camp ID from the URL parameter

    // Find bookings where createdBy === userId && CampType  == Camp 
    const existingBookings = await Booking.find({ eventID: eventID, bookingType:'Event' });

     // Send the existing bookings in the response
     res.json(existingBookings);
  
    } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});






module.exports = router;