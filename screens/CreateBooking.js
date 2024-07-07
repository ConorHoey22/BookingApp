import React, { useEffect, useState } from 'react';
import { ScrollView,StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { StripeProvider, useStripe } from "@stripe/stripe-react-native";

import DropDownPicker from 'react-native-dropdown-picker';

const CreateBooking = ({navigation}) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState([]);
  const [campData, setCampData] = useState([]);
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
  const [dateValidationMessage, setSelectDateErrorMessage] = useState('');


  const [editNameValidationMessage, setEditNameValidationMessage] = useState('');
  const [editPhoneNumberValidation, setEditPhoneNumberValidationMessage] = useState('');
  const [editDateValidationMessage, setEditSelectDateErrorMessage] = useState('');


  //Modal 
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [displayEditParticipantModal, setDisplayEditParticipantModal] = useState(false);
  const [displayBreakdownCostOverviewModal, setDisplayBreakdownCostOverviewModal] = useState(false);
  const [displaySelectDaysOfCampModal, setDisplaySelectDaysOfCampModalVisible] = useState(false);
  const [editedBookingRecordArray, setEditedBookingRecordArray] = useState(-1);



  const route = useRoute();

  const [receivedCampID, setReceivedCampID] = useState('');
  const [receivedCampName, setReceivedCampName] = useState('');
  const [receivedLocation, setReceivedLocation] = useState('');
  const [receivedPriceDay1, setReceivedPriceDay1] = useState('');
  const [receivedPriceDay2, setReceivedPriceDay2] = useState('');
  const [receivedPriceDay3, setReceivedPriceDay3] = useState('');
  const [receivedPriceDay4, setReceivedPriceDay4] = useState('');
  const [receivedPriceDay5, setReceivedPriceDay5] = useState('');
  const [receivedStartDate, setReceivedStartDate] = useState('');
  const [receivedStartTime, setReceivedStartTime] = useState('');
  const [receivedEndDate, setReceivedEndDate] = useState('');
  const [receivedEndTime, setReceivedEndTime] = useState('');


  //Array for Camp Offer data
  const [campOfferData, setCampOffersData] = useState([]);
  const [tempDiscountArray, setTempDiscountArray] = useState([]);
  const [tempRewardArray, setTempRewardArray] = useState([]);



  useEffect(() => {
    const checkAuthentication = async () => {
      try {

        const jwtToken = await AsyncStorage.getItem('jwtToken');
        setIsLoggedIn(!!jwtToken);



// Check number of Camps the User has booked 



//-----------------------------
      //Get API Request - Fetch all camps offers 
      const apiGetCampsOffers = 'http://localhost:3000/api/getCampOffers';

      
      try {
    
          const response = await fetch(apiGetCampsOffers, {
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
    
          // Set the campData state with the fetched data
          setCampOffersData(data);
    
    
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

            if (route.params && route.params.camp) {
              const { camp } = route.params;
        
  
        
              // Ensure camp object has startDate property before accessing it
              if (camp.startDate) {
                setReceivedCampID(camp._id);
                setReceivedCampName(camp.campName);
                setReceivedLocation(camp.location);
                setReceivedPriceDay1(camp.price1Day);
                setReceivedPriceDay2(camp.price2Day);
                setReceivedPriceDay3(camp.price3Day);
                setReceivedPriceDay4(camp.price4Day);
                setReceivedPriceDay5(camp.price5Day);
                setReceivedStartDate(new Date(camp.startDate));
                setReceivedStartTime(camp.startTime);
                setReceivedEndDate(new Date(camp.endDate));
                setReceivedEndTime(camp.endTime);
              } else {
                console.error("Start date is missing in camp object");
              }
            } else {
              console.error("Camp object is missing in route params:");
            }


          
      
      
        } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
        }
      
      
      
      
      } catch (error) {
        console.error('Error fetching JWT token:', error);
      }



        const dayNames = getDayNamesInRange().map((dayName, index) => ({
          label: dayName,
          value: `${index}-${dayName}`, // Ensure unique value
        }));
        setItems(dayNames);

    

      if(displayEditParticipantModal == true)
      {
        setValueEdit(editedDaysSelected);
      }




    };

    checkAuthentication(); // Call the function to check authentication status when component mounts

  
  
  }, [route.params]); // Empty dependency array ensures the effect runs only once when component mounts


 


  

    const handleLogOut = async () => {
        await AsyncStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
        navigation.navigate('Login');
    };
    
    // Function to close the modal and reset editedCampIndex
    const closeEditModal = () => {
      setEditModalVisible(false);

    };


        // Function to close the modal 
        const closeSelectEditParticipantModal = () => {
          setDisplayEditParticipantModal(false);
    
        };


         // Function to close the modal 
         const closeDaysOfCampsModal = () => {
          setDisplaySelectDaysOfCampModalVisible(false);
    
        };
        

           // Function to close the modal 
           const closeCostBreakdownModal = () => {
            setDisplayBreakdownCostOverviewModal(false);
      
          };
    
    

  


    const updateBookingRecord = async(index) => { 

      //Check that Name and Phone number is still present 

    //  Validation Check
    if ((!editedNameText || /^\s*$/.test(editedNameText)) || (!editedPhoneNumberText || /^\s*$/.test(editedPhoneNumberText)) || (!editedDaysSelected || /^\s*$/.test(editedDaysSelected)) ) {
          
      
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

      if (!editedDaysSelected || /^\s*$/.test(editedDaysSelected)) {
        setEditSelectDateErrorMessage('Please select at least 1 day');
      } else {
        setEditSelectDateErrorMessage('');
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
        daysSelectedArray: editedDaysSelected



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

    const ModalOpenDisplaySelectDaysOfCamp = async() => {
    

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
      setDisplaySelectDaysOfCampModalVisible(true);




    

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
        


// IF DATES ARE NOT SELECTED THEY CANNOT PROGRESS
if (value.length === 0) 
{
  const dateValidationMessage = "Please select at least 1 day"
  setSelectDateErrorMessage(dateValidationMessage);
} 
else {



          // This to add the participant to the array as we dont want to send the data to the DB until CHECKOUT 
          const newParticpant = { 
                
            name: name,
            age: age,
            allergies: allergies,
            emergencyContactNumber: phoneNumber,
            additionalInfo: additionalInfo,
            attendanceStatus: 'Booked',
            reasonForRefund: 'N/A',
            daysSelectedArray: value,
            totalParticipantPrice: 0
               
        
          };

          setParticipantArray(prevArray => {
            const newArray = prevArray.concat(newParticpant);
    
            return newArray;
          });

          setParticipantCount(participantCount + 1);



    // Modal appears
    setDisplaySelectDaysOfCampModalVisible(false);

    

          setName(''); // Clearing the text input by updating the state
          setAge(''); // Clearing the text input by updating the state
          setAllergies(''); // Clearing the text input by updating the state
          setPhoneNumber(''); // Clearing the text input by updating the state
          setAdditionalInfo(''); // Clearing the text input by updating the state
 
    




      }
    }


    };


    // ------------- Modal Edit ------------------------------

    const [editedNameText, setEditedNameText] = useState(''); // Edited text for the camp being edited
    const [editedAgeText, setEditedAgeText] = useState(''); // Edited text for the camp being edited
    const [editedAllergiesText, setEditedAllergiesText] = useState(''); // Edited text for the camp being edited
    const [editedPhoneNumberText, setEditedPhoneNumberText] = useState(''); // Edited text for the camp being edited
    const [editedAdditionalInfoText, setEditedAdditionalInfoText] = useState(''); // Edited text for the camp being edited
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
        setValueEdit(participantArray[index].daysSelectedArray);


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

    //  ------------------ Calculate Total Cost of the Camp  -------------------
                  for (let i = 0; i < participantArray.length; i++) {
        
                      //Participant Pricing Setting
                      if (participantArray[i].daysSelectedArray.length === 1)
                      {
                        participantArray[i].totalParticipantPrice = receivedPriceDay1;
                      }
                      else if(participantArray[i].daysSelectedArray.length === 2)
                      {
                        participantArray[i].totalParticipantPrice = receivedPriceDay2;            
                      }
                      else if(participantArray[i].daysSelectedArray.length === 3)
                      {
                        participantArray[i].totalParticipantPrice = receivedPriceDay3;
                      }
                      else if(participantArray[i].daysSelectedArray.length === 4)
                      {
                        participantArray[i].totalParticipantPrice = receivedPriceDay4;
                      }
                      else if(participantArray[i].daysSelectedArray.length === 5)
                      {
                        participantArray[i].totalParticipantPrice = receivedPriceDay5;
                      }


                  
                    //Add ParticipantPrice 
                    totalParticipantPrice += parseFloat(participantArray[i].totalParticipantPrice);


                  }

                
                  //Check if Camp Offer isActive , Discount / Reward
                  let tempCampOfferArray = [];

                  //Loop around campOfferData
                  for (let i = 0; i < campOfferData.length; i++) {

                    //Only if campOffer isActive is true
                    if (campOfferData[i].isActive == true) {

                        //Push to Temp Array which will hold all active arrays 
                        tempCampOfferArray.push(campOfferData[i]);
                    
                    }

                  }

                  //Set Discount and Rewards 
                     for (let i = 0; i < tempCampOfferArray.length; i++) {

                      //Only if campOffer isActive is true
                      if (tempCampOfferArray[i].reward !== undefined) {
                        
                          //Push to Temp Array which will hold all active arrays 
                          tempRewardArray.push(tempCampOfferArray[i].reward);
                      
                      }

                      // Only if campOffer isActive is true
                      if (tempCampOfferArray[i].percentageDiscount !== undefined) {
                      
                        // Push to Temp Array which will hold all active discounts
                        tempDiscountArray.push(parseFloat(tempCampOfferArray[i].percentageDiscount));
                      }

                    }

                
                let maxDiscount;
              
                // Find the maximum discount in tempDiscountArray
                if (tempDiscountArray.length > 0) {

                  maxDiscount = tempDiscountArray.length > 0 ? Math.max(...tempDiscountArray) : 0;

                    
                    // Update state with the new tempDiscountArray
                    setTempDiscountArray([maxDiscount]);

                  // What if there is no offer or discount ??
                  //Calculate final cost : CampCost Divide by Discount %           
                  
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
          campID: receivedCampID,
          location: receivedLocation,
          price: totalBookingPrice,
          startDate: receivedStartDate,
          endDate: receivedEndDate,
          startTime: receivedStartTime,
          endTime: receivedEndTime,
          participantsBooked: participantCount,
          participantArray: participantArray,
          discount: tempDiscountArray,
          reward: tempRewardArray
        };
          

      const apiCreateBooking = 'http://localhost:3000/api/campPayment';
      const jwtToken = await AsyncStorage.getItem('jwtToken');

          const response = await fetch(apiCreateBooking, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({ amount: totalBookingPrice, bookingName: bookingName , email: userData.email , fullname : userData.fullName , campID: receivedCampID , eventName: receivedCampName , reward: tempRewardArray , discount: tempDiscountArray}),
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

            const apiBookingCampRecord = 'http://localhost:3000/api/createBookingCampRecord';
            const responseRecord = await fetch(apiBookingCampRecord, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
              },
              body: JSON.stringify(requestData),
            });
            
            if (responseRecord.ok) {
              const jsonResponse2 = await responseRecord.json();
              console.log('Camp Booking record Created', jsonResponse2);

              //Send User back to dashboard
              navigation.navigate('Dashboard');
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

        
    };

    // Get day name for a given date
    const getDayName = (date) => {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return dayNames[date.getDay()];
    };
    

    // Get array of day names between minDate and maxDate
    // Get array of day names between startDate and endDate
    const getDayNamesInRange = () => {
      const dayNames = [];
      const currentDate = new Date(receivedStartDate);
      while (currentDate <= receivedEndDate) {
        dayNames.push(getDayName(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dayNames;
    };

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
const [editedDaysSelected, setValueEdit] = useState(initialValueEdit);
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
     
    <View style={styles.container2}>
          <View style={styles.container}>



    <View style ={styles.containerCard}>
  
      <Text style={styles.label}>Enter your name *: </Text>
        <Text>{bookingNameValidationMessage}</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter here"
          value={bookingName}
          onChangeText={(text) => setBookingName(text)}
        />

        <Text style={styles.label}>Enter the name of the participant attending *: </Text>
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

        <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText} onPress={ModalOpenDisplaySelectDaysOfCamp}>Submit Participant</Text>
        </TouchableOpacity>

        


      </View>

    </View>
    </View>
    </StripeProvider> 

    </ScrollView>
 
 

  );
};

export default CreateBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%', // Width of the container (adjust as needed)
    height: '10%', // Height of the container (adjust as needed)
    backgroundColor: '#00e3ae',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 150, // Adjust this value for the desired curvature
    borderBottomRightRadius: 150, // Adjust this value for the desired curvature

  },
  container2:{

    flex: 1,
    width: '100%', // Width of the container (adjust as needed)
    height: '100%', // Height of the container (adjust as needed)
    backgroundColor: '#ecf0ff',
    alignItems: 'center',
    justifyContent: 'center',


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
    containerCard: {
      borderWidth: 8,
      borderColor: '#ffffff',
      borderRadius: 30,
      padding: 10,
      marginTop: 80,
      width: 'auto',
      backgroundColor: '#ecf0ff',
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
 
      borderRadius: 10,
      marginTop: 30,
      paddingVertical: 15,
      alignItems: 'center',
      backgroundColor: '#6558d3',
      borderRadius: 15,
      padding: 2,
      zIndex: 2, // Ensure dropdown is above other elements

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
