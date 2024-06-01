// Create an Event Booking 

import React, { useEffect, useState } from 'react';
import { ScrollView,StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { StripeProvider, useStripe } from "@stripe/stripe-react-native";

import DropDownPicker from 'react-native-dropdown-picker';

const CreateEventBookings = ({navigation}) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [allergies, setAllergies] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [totalBookingPrice, setTotalBookingPrice] = useState(0); 
  
  
  const [bookingName, setBookingName] = useState('');
  const stripe = useStripe();
 
  //Form Validation
  const [bookingNameValidationMessage, setBookingNameValidation] = useState('');
  const [nameValidationMessage, setNameValidationMessage] = useState('');
  const [phoneNumberValidation, setPhoneNumberValidationMessage] = useState('');


  const [editNameValidationMessage, setEditNameValidationMessage] = useState('');
  const [editPhoneNumberValidation, setEditPhoneNumberValidationMessage] = useState('');


  //Modal 
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [displayEditParticipantModal, setDisplayEditParticipantModal] = useState(false);
  const [displayBreakdownCostOverviewModal, setDisplayBreakdownCostOverviewModal] = useState(false);
  const [editedBookingRecordArray, setEditedBookingRecordArray] = useState(-1);



  const route = useRoute();

  const [receivedEventID, setReceivedEventID] = useState('');
  const [receivedEventName, setReceivedEventName] = useState('');
  const [receivedLocation, setReceivedLocation] = useState('');
  const [receivedPrice, setReceivedPrice] = useState('');

  const [receivedStartDate, setReceivedStartDate] = useState('');
  const [receivedStartTime, setReceivedStartTime] = useState('');
  const [receivedEndTime, setReceivedEndTime] = useState('');


  //Array for Event Offer data
  const [eventOfferData, setEventOffersData] = useState([]);
  const [tempDiscountArray, setTempDiscountArray] = useState([]);
  const [tempRewardArray, setTempRewardArray] = useState([]);



  useEffect(() => {
    const checkAuthentication = async () => {
      try {

        const jwtToken = await AsyncStorage.getItem('jwtToken');
        setIsLoggedIn(!!jwtToken);



// Check number of Events the User has booked 



//-----------------------------
      //Get API Request - Fetch all events offers 
      const apiGetEventOffers = 'http://localhost:3000/api/getEventOffers';

      
      try {
    
          const response = await fetch(apiGetEventOffers, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          // Parse the response as JSON
          const data = await response.json();
    
          // Set the eventData state with the fetched data
          setEventOffersData(data);
    
    
          } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
          }

          // --------------------------------------------------------------------------

            const apiGetUsers = 'http://localhost:3000/api/user/:userId';
            
            try {
              const response = await fetch(apiGetUsers, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtToken}`,
                },
              });
        
        
        
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            // Parse the response as JSON
            const data = await response.json();
      
            // Set the userData state with the fetched data
            setUserData(data);

            if (route.params && route.params.event) {
              const { event } = route.params;
        
  
        
              // Ensure event object has startDate property before accessing it
              if (event.startDate) {
                setReceivedEventID(event._id);
                setReceivedEventName(event.eventName);
                setReceivedLocation(event.location);
                setReceivedPrice(event.price);
                setReceivedStartDate(new Date(event.startDate));
                setReceivedStartTime(event.startTime);
                setReceivedEndTime(event.endTime);
              } else {
                console.error("Start date is missing in event object");
              }
            } else {
              console.error("Event object is missing in route params:");
            }

        } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
        }
      
      
      
      
      } catch (error) {
        console.error('Error fetching JWT token:', error);
      }

    

    };

    checkAuthentication(); // Call the function to check authentication status when component mounts

  
  
  }, [route.params]); // Empty dependency array ensures the effect runs only once when component mounts


 


  

    const handleLogOut = async () => {
        await AsyncStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
        navigation.navigate('Login');
    };
    
    // Function to close the modal and reset editedEventIndex
    const closeEditModal = () => {
      setEditModalVisible(false);

    };


        // Function to close the modal 
        const closeSelectEditParticipantModal = () => {
          setDisplayEditParticipantModal(false);
    
        };


         // Function to close the modal 
         const closeDaysOfEventsModal = () => {
          setDisplaySelectDaysOfEventModalVisible(false);
    
        };
        

           // Function to close the modal 
           const closeCostBreakdownModal = () => {
            setDisplayBreakdownCostOverviewModal(false);
      
          };
    
    

  


    const updateBookingRecord = async(index) => { 

      //Check that Name and Phone number is still present 

    //  Validation Check
    if ((!editedNameText || /^\s*$/.test(editedNameText)) || (!editedPhoneNumberText || /^\s*$/.test(editedPhoneNumberText)) ) {
          
      
      // If any field is blank, show respective validation messages
      if (!editedNameText || /^\s*$/.test(editedNameText)) {
        setEditNameValidationMessage('Enter their name');
      } else {
        setEditNameValidationMessage('');
      }
    
      if (!editedPhoneNumberText || /^\s*$/.test(editedPhoneNumberText)) {
        setEditPhoneNumberValidationMessage('Enter their contact number');
      } else {
        setEditPhoneNumberValidationMessage('');
      }

    

    }
    else{

      //Update Array with record  - We will not be updating the DB until after the payment 

      const updatedBookingRecord = {
        name: editedNameText,
        age: editedAgeText,
        allergies: editedAllergiesText,
        emergencyContactNumber: editedPhoneNumberText,
        additionalInfo: editedAdditionalInfoText,
        attendanceStatus: "Booked",
     



      };
    
      participantArray[index] = updatedBookingRecord;


      // Close the modal
      closeEditModal();
    }
  }

    const [participantArray, setParticipantArray] = useState([]);
    const [participantCount, setParticipantCount] = useState(0);

    const SelectEditParticipantModal = async() => {
      // Set the value state with previously selected dates when component mounts
  
      setDisplayEditParticipantModal(true);



    };

    const ModalOpenDisplaySelectDaysOfEvent = async() => {
    

      // Check Values 
    

      // IF there is no values enter in all required then kick in Validation 
  //Form Validation

  if ((!name || /^\s*$/.test(name)) || (!phoneNumber || /^\s*$/.test(phoneNumber)) || (!bookingName || /^\s*$/.test(bookingName)) ) {
          
    if (!bookingName || /^\s*$/.test(bookingName)) {
      setBookingNameValidation('Enter your name');
    } else {
      setBookingNameValidation('');
    }
    
    
    // If any field is blank, show respective validation messages
    if (!name || /^\s*$/.test(name)) {
      setNameValidationMessage('Enter their name');
    } else {
      setNameValidationMessage('');
    }
  
    if (!phoneNumber || /^\s*$/.test(phoneNumber)) {
      setPhoneNumberValidationMessage('Enter their contact number');
    } else {
      setPhoneNumberValidationMessage('');
    }
  } else {
      // Modal appears
      setDisplaySelectDaysOfEventModalVisible(true);




    

  }

      
    };



    const addParticipant = async() => {
   
        //Form Validation

        if ((!name || /^\s*$/.test(name)) || (!phoneNumber || /^\s*$/.test(phoneNumber)) || (!bookingName || /^\s*$/.test(bookingName)) ) {
          
          if (!bookingName || /^\s*$/.test(bookingName)) {
            setBookingNameValidation('Enter your name');
          } else {
            setBookingNameValidation('');
          }
          
          
          // If any field is blank, show respective validation messages
          if (!name || /^\s*$/.test(name)) {
            setNameValidationMessage('Enter their name');
          } else {
            setNameValidationMessage('');
          }
        
          if (!phoneNumber || /^\s*$/.test(phoneNumber)) {
            setPhoneNumberValidationMessage('Enter their contact number');
          } else {
            setPhoneNumberValidationMessage('');
          }
        } else {
        

          // This to add the participant to the array as we dont want to send the data to the DB until CHECKOUT 
          const newParticpant = { 
                
            name: name,
            age: age,
            allergies: allergies,
            emergencyContactNumber: phoneNumber,
            additionalInfo: additionalInfo,
            attendanceStatus: 'Booked',
            reasonForRefund: 'N/A',
            totalParticipantPrice: 0
               
        
          };

          setParticipantArray(prevArray => {
            const newArray = prevArray.concat(newParticpant);
    
            return newArray;
          });

          setParticipantCount(participantCount + 1);


          setName(''); // Clearing the text input by updating the state
          setAge(''); // Clearing the text input by updating the state
          setAllergies(''); // Clearing the text input by updating the state
          setPhoneNumber(''); // Clearing the text input by updating the state
          setAdditionalInfo(''); // Clearing the text input by updating the state
 
    




      }
    };


    // ------------- Modal Edit ------------------------------

    const [editedNameText, setEditedNameText] = useState(''); // Edited text for the event being edited
    const [editedAgeText, setEditedAgeText] = useState(''); // Edited text for the event being edited
    const [editedAllergiesText, setEditedAllergiesText] = useState(''); // Edited text for the event being edited
    const [editedPhoneNumberText, setEditedPhoneNumberText] = useState(''); // Edited text for the event being edited
    const [editedAdditionalInfoText, setEditedAdditionalInfoText] = useState(''); // Edited text for the event being edited
    // const [editedDaysSelected, setEditedDaysSelected ] = useState(''); 
    
    const editParticipantModal = async(index) => {
        // This to edit the participant to the array as we dont want to send the data to the DB until CHECKOUT 
        

        setDisplayEditParticipantModal(false);

        // Modal appears
        setEditModalVisible(true);

        setDisplayEditParticipantModal(false);
        
        // Get index of Array 
        setEditedBookingRecordArray(index);

        // Pre fill form with data
        setEditedNameText(participantArray[index].name);
        setEditedAgeText(participantArray[index].age);
        setEditedAllergiesText(participantArray[index].allergies);
        setEditedPhoneNumberText(participantArray[index].emergencyContactNumber);
        setEditedAdditionalInfoText(participantArray[index].additionalInfo);
      


    };


    const removeParticipant = async(index) => {
        // This to remove the participant to the array as we dont want to send the data to the DB until CHECKOUT 
    
      // Update Participant Count 
      setParticipantCount(participantCount - 1);

      // Remove the record from the local state
      setParticipantArray((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;

      });



    };




//Handle payment 
    const handleBookingCheckout = async() => {

    let totalParticipantPrice = 0;

    //  ------------------ Calculate Total Cost of the Event  -------------------
                  for (let i = 0; i < participantArray.length; i++) {
        
                    //Participant Pricing Setting           
                    participantArray[i].totalParticipantPrice = receivedPrice;

                    //Add ParticipantPrice 
                    totalParticipantPrice += parseFloat(participantArray[i].totalParticipantPrice);
                    

                  }

                
                  //Check if Event Offer isActive , Discount / Reward
                  let tempEventOfferArray = [];

                  //Loop around eventOfferData
                  for (let i = 0; i < eventOfferData.length; i++) {

                    //Only if eventOffer isActive is true
                    if (eventOfferData[i].isActive == true) {

                        //Push to Temp Array which will hold all active arrays 
                        tempEventOfferArray.push(eventOfferData[i]);
                    
                    }

                  }

                  //Set Discount and Rewards 
                     for (let i = 0; i < tempEventOfferArray.length; i++) {

                      //Only if eventOffer isActive is true
                      if (tempEventOfferArray[i].reward !== undefined) {
                        
                          //Push to Temp Array which will hold all active arrays 
                          tempRewardArray.push(tempEventOfferArray[i].reward);
                      
                      }

                      // Only if eventOffer isActive is true
                      if (tempEventOfferArray[i].percentageDiscount !== undefined) {
                      
                        // Push to Temp Array which will hold all active discounts
                        tempDiscountArray.push(parseFloat(tempEventOfferArray[i].percentageDiscount));
                      }

                    }

                
                let maxDiscount;
              
                // Find the maximum discount in tempDiscountArray
                if (tempDiscountArray.length > 0) {

                  maxDiscount = tempDiscountArray.length > 0 ? Math.max(...tempDiscountArray) : 0;

                    
                    // Update state with the new tempDiscountArray
                    setTempDiscountArray([maxDiscount]);

                  // What if there is no offer or discount ??
                  //Calculate final cost : EventCost Divide by Discount %           
                  
                  // Calculate the discounted price
                  const discountAmount = (totalParticipantPrice * maxDiscount) / 100;
                  const discountedPrice = totalParticipantPrice - discountAmount;



                  const formatter = new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP', // Change to GBP for British Pound
                });
                
                // Format the total booking price as currency string with currency symbol
                const formattedTotalBookingPrice = formatter.format(discountedPrice);
         

                // Remove currency symbol
                const valueWithoutCurrencySymbol = formattedTotalBookingPrice.replace(/[^\d.-]/g, '');

                // Set the total booking price
                setTotalBookingPrice(valueWithoutCurrencySymbol);




  
                    // Wait for Set
                    await new Promise(resolve => setTimeout(resolve, 0));
  
  



                 

                }
                else{ // Normal Booking , no Discount

          
                  const formatter = new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: 'GBP', // Change to GBP for British Pound
                  });
                  
                  // Format the total booking price as currency string with currency symbol
                  const formattedTotalBookingPrice = formatter.format(totalParticipantPrice);
           
  
                  // Remove currency symbol
                  const valueWithoutCurrencySymbol = formattedTotalBookingPrice.replace(/[^\d.-]/g, '');
  
                  // Set the total booking price
                  setTotalBookingPrice(valueWithoutCurrencySymbol);
  
  





                    // Update state with the new tempRewardArray  we dont mind setting this here as its not money
                    setTempRewardArray(tempRewardArray);
                }

                  //Display BreakDown Cost Overiew Modal 
                  setDisplayBreakdownCostOverviewModal(true);


          
                  


    };

   

    const processPaymentWithAPI = async() => {

                    
        // Handle Stripe API and payment once the payment is confirm / made , then we will then Participant array and push the data to the DB 
        try {

        // Construct the request payload
        const requestData = {
          email: userData.email,
          fullName: userData.fullName,
          bookingName: bookingName,
          eventID: receivedEventID,
          location: receivedLocation,
          price: totalBookingPrice,
          startDate: receivedStartDate,
          startTime: receivedStartTime,
          endTime: receivedEndTime,
          participantsBooked: participantCount,
          participantArray: participantArray,
          discount: tempDiscountArray,
          reward: tempRewardArray
        };
          

      const apiCreateEventBooking = 'http://localhost:3000/api/eventPayment';
      const jwtToken = await AsyncStorage.getItem('jwtToken');

          const response = await fetch(apiCreateEventBooking, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({ amount: totalBookingPrice, bookingName: bookingName , email: userData.email , fullname : userData.fullName , eventID: receivedEventID , eventName: receivedEventName , reward: tempRewardArray , discount: tempDiscountArray}),
          });
          const data = await response.json();
          if (!response.ok) {
            return Alert.alert(data.message);
          }
          const initSheet = await stripe.initPaymentSheet({
            paymentIntentClientSecret: data.clientSecret,
          });
          if (initSheet.error) {
            console.error(initSheet.error);
            return Alert.alert(initSheet.error.message);
          }
          const presentSheet = await stripe.presentPaymentSheet({
            clientSecret: data.clientSecret,
          });
          if (presentSheet.error) {
            console.error(presentSheet.error);
            return Alert.alert(presentSheet.error.message);
          }
          Alert.alert("Payment Successful! Thank You!");

          //Create Booking on DB 
          try{

            const apiBookingEventRecord = 'http://localhost:3000/api/createBookingEventRecord';
            const responseRecord = await fetch(apiBookingEventRecord, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
              },
              body: JSON.stringify(requestData),
            });
            
            if (responseRecord.ok) {
              const jsonResponse2 = await responseRecord.json();
              console.log('Event Booking record Created', jsonResponse2);

              //Send User back to dashboard
              navigation.navigate('DashboardCRM');
            } else {
              console.log('Error Status:', responseRecord.status);
              console.log('Error Message:', responseRecord.statusText);
              let errorMessage2 = 'Unknown error occurred.';
              try {
                const jsonResponse2 = await responseRecord.json();
                errorMessage2 = jsonResponse2.message || jsonResponse2.error || jsonResponse2.errorMessage2 || errorMessage;
              } catch (error) {
                errorMessage2 = response.statusText || errorMessage2;
              }
              console.log('Error Message from JSON:', errorMessage2);
            }

          }
          catch (error) {
            console.error('Network Error:', error.message);
            // Handle the error here. For example, set an error message state
            Alert.alert (error.message);
          }


        

        } catch (err) {
          console.error(err);
          Alert.alert("Payment failed!");
        }

      }

// ------ Main - DDL ---- 

// Define initial values
const initialValue = []; // Provide an initial value for 'value' state
const initialItems = []; // Provide an initial value for 'items' state

const [open, setOpen] = useState(false);
const [value, setValue] = useState(initialValue);
const [items, setItems] = useState(initialItems);

// Usage example of setValue
const updateValue = (newValue) => {
  setValue(newValue);
};

// Usage example of setItems
const updateItems = (newItems) => {
  setItems(newItems);
};

//------------

// Define initial values
const initialValueEdit = []; // Provide an initial value for 'value' state
const initialItemsEdit = []; // Provide an initial value for 'items' state

const [openEdit, setOpenEdit] = useState(false);
const [itemsEdit, setItemsEdit] = useState(initialItemsEdit);

// Usage example of setValue
const updateValueEdit = (newValue) => {
  setValueEdit(newValue);
};

// Usage example of setItems
const updateItemsEdit = (newItems) => {
  setItemsEdit(newItems);
};




  return (
 
  <ScrollView>

   <StripeProvider publishableKey='pk_test_51OnkfED7nseNwvj8Zgtfn4YbMAQbVl2Y3yWn56QAF6rLJmAn6ez4Wyp24aLIEtzLLEs15N06P0FxI5w9I8jnTvaf00DjYAqVWL'>
    
    <ScrollView>
    <Text style={styles.label}>Enter your name *: </Text>
        <Text>{bookingNameValidationMessage}</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter here"
          value={bookingName}
          onChangeText={(text) => setBookingName(text)}
        />
    {/* Get Booking details */}
    <View style={styles.container}>
        <Text style={styles.label}>Enter the name of the participant *: </Text>
        <Text>{nameValidationMessage}</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter here"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Text style={styles.label}>Age: </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter here"
          value={age}
          onChangeText={(text) => setAge(text)}
        />
        <Text style={styles.label}>Have they any Allergies: </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter here"
          value={allergies}
          onChangeText={(text) => setAllergies(text)}
        />
        <Text style={styles.label}>Emergency Contact Number *: </Text>
        <Text>{phoneNumberValidation}</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter here"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
        <Text style={styles.label}>Anything else you would like us to know? : e.g. Special requests: </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter here"
          value={additionalInfo}
          onChangeText={(text) => setAdditionalInfo(text)}
        />
      </View>

        <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText} onPress={addParticipant}>Submit Participant</Text>
        </TouchableOpacity>
    </ScrollView>

     



{/* This should only appear if user enter at least on particpant */}
  <View>
    {/* Conditional rendering using a ternary operator */}
    {participantCount >= 1 ? (

  <View>
     
    {/*  */}
      <View>
        <TouchableOpacity style={styles.button} onPress={SelectEditParticipantModal}>
                  <Text style={styles.buttonText}>Edit Participant Details</Text>
        </TouchableOpacity>
      </View>


     
      <View>
        <TouchableOpacity style={styles.button} onPress={handleBookingCheckout}>
                <Text style={styles.buttonText}>Continue to Checkout</Text>
        </TouchableOpacity>
      </View>

  </View>




    ) : (
      <View>
  
      </View>
    )}
  </View>
 
  

   


    {/* This will only appear when 1 particpant is added to the array count  */}
   
   <Modal
      animationType="slide"
      transparent={true}
      visible={displayEditParticipantModal}
      onRequestClose={closeSelectEditParticipantModal}
    >
      <View style={styles.modalContainer}>

      <ScrollView style={styles.modalContent}>
          
      
         


   
 
    <Text style={styles.label}>Participant Booking List:</Text>
    {/* Display Participant , Be able to Edit / Delete from booking  */}

    {participantArray.map((item, index) => (
         <View key={index} style={styles.container}>
 
          <Text style={styles.label}>Name: {item.name}</Text>

          <Text style={styles.label}>Age: {item.age}</Text>
          <Text style={styles.label}>Allergies: {item.allergies}</Text>
          <Text style={styles.label}>Emergency Contact Number: {item.emergencyContactNumber}</Text>
      
          <Text style={styles.label}>Anything else you would like us to know: {item.additionalInfo}</Text>
   

          <View>
            <TouchableOpacity style={styles.button} onPress={() => editParticipantModal(index)}>
                <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => removeParticipant(index)}>
                <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
          </View>

      ))}

            <TouchableOpacity style={styles.button} onPress={closeSelectEditParticipantModal}>
                <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>

  
      </ScrollView>
      </View>
  
      
     
</Modal>
   


   {/* Modal EDIT */}


    <Modal
      animationType="slide"
      transparent={true}
      visible={editModalVisible}
      onRequestClose={closeEditModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <View style={{ flexDirection: 'column' }}>
          <View>
            <Text style={styles.label}>Name</Text>
            <Text>{editNameValidationMessage}</Text>
            <TextInput
              style={styles.textInput}
              value={editedNameText}
              onChangeText={setEditedNameText}
              placeholder='Enter here..'
            />
          </View>

          <View>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.textInput}
              value={editedAgeText}
              onChangeText={setEditedAgeText}
              placeholder='Enter here..'
            />
          </View>

          <View>
            <Text style={styles.label}>Allergies</Text>
            <TextInput
              style={styles.textInput}
              value={editedAllergiesText}
              onChangeText={setEditedAllergiesText}
              placeholder='Enter here..'
            />
          </View>

          <View>
            <Text style={styles.label}>Emergency Contact Number</Text>
            <Text>{editPhoneNumberValidation}</Text>
            <TextInput
              style={styles.textInput}
              value={editedPhoneNumberText}
              onChangeText={setEditedPhoneNumberText}
              placeholder='Enter here..'
            />
          </View>


          <View>
            <Text style={styles.label}>Anything else you would like us to know? : e.g. Special requests:</Text>
            <TextInput
              style={styles.textInput}
              value={editedAdditionalInfoText}
              onChangeText={setEditedAdditionalInfoText}
              placeholder='Enter here..'
            />
          </View>



          <View style={styles.buttonContainer}>

            <TouchableOpacity style={styles.button2} onPress={() => updateBookingRecord(editedBookingRecordArray)}>
              <Text style={styles.buttonText}>Update Booking</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.buttonContainer}>

            <TouchableOpacity style={styles.button2} onPress={closeEditModal}>
              <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>

          </View>
          </View>
        </View>

        </View>  

    



    </Modal>


    <Modal
      animationType="slide"
      transparent={true}
      visible={displayBreakdownCostOverviewModal}
      onRequestClose={closeCostBreakdownModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

        <View style={{ flexDirection: 'column' }}>
          
          <Text>Total Cost Breakdown</Text>

          {participantArray.map((item, index) => (
            <View key={index} style={styles.container}>
    
              <Text style={styles.label}>Name: {item.name}</Text>
              <Text style={styles.label}>Price: £{item.totalParticipantPrice}</Text>
            
              
            </View>

          ))}



        <View style={styles.container}>

          <Text style={styles.label}>Discount:{tempDiscountArray}%</Text>
          <Text style={styles.label}>Cost: £{totalBookingPrice}</Text>
          
        </View>

                        
        </View>  




         <View>
            <TouchableOpacity style={styles.button} onPress={processPaymentWithAPI}>
                <Text style={styles.buttonText}>Make Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={closeCostBreakdownModal}>
                <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>
          </View>

              </View> 


        </View>

  </Modal>





    </StripeProvider>
  </ScrollView>
  

  );
};

export default CreateEventBookings;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 20,
    margin: 20,
    width: 'auto',
  },
  validationText: {
    fontSize: 20,
    marginBottom: 10,
    color: 'red',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
   modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
    fieldRow: {
      flexDirection: 'row',
       marginTop: 15,
       marginBottom: 10,
    },
    label: {
      // marginBottom: 5,
      fontWeight: 'bold',
    },
    textInput: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    buttonContainer:{
      marginTop:30
    },
    button: {
      backgroundColor: '#4CAF50',
      borderRadius: 4,
      padding: 10,
      marginBottom: 5,
      
    },
    button1: {
      backgroundColor: '#4CAF50',
      borderRadius: 4,
      padding: 10,
      zIndex: 2, // Ensure dropdown is above other elements
      marginBottom: 5,
     
    },
    button2: {
      backgroundColor: '#4CAF50',
      borderRadius: 4,
      padding: 10,
      zIndex: 2, // Ensure dropdown is above other elements
      marginBottom: 5,
     
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
    containerd: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    dropdownContainer: {
      position: 'relative',
      marginBottom: 30, // Adjust this value as needed to prevent overlap
      zIndex: 1, // Ensure dropdown is above other elements
    },
    dropdown: {
       position: 'absolute',
      zIndex: 1, // Ensure dropdown is above other elements
      width: '100%',
    },
    
});
