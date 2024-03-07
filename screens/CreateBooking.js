import React, { useEffect, useState } from 'react';
import { ScrollView,StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

import { StripeProvider, useStripe } from "@stripe/stripe-react-native";

const CreateBooking = ({navigation}) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [campData, setCampData] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [allergies, setAllergies] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [bookingName, setBookingName] = useState('');
  const stripe = useStripe();

  //Form Validation
  const [bookingNameValidationMessage, setBookingNameValidation] = useState('');
  const [nameValidationMessage, setNameValidationMessage] = useState('');
  const [phoneNumberValidation, setPhoneNumberValidationMessage] = useState('');

  //Modal 
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedBookingRecordArray, setEditedBookingRecordArray] = useState(-1);



  const route = useRoute();
  const receivedCampID = route.params?.camp._id;
  const receivedCampName = route.params?.camp.campName;
  const receivedLocation = route.params?.camp.location;
  const receivedPrice = route.params?.camp.price;
  const receivedStartDate = route.params?.camp.startDate;
  const receivedStartTime = route.params?.camp.startTime;
  const receivedEndDate = route.params?.camp.endDate;
  const receivedEndTime = route.params?.camp.endTime;


  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        setIsLoggedIn(!!jwtToken);

      
      } catch (error) {
        console.error('Error fetching JWT token:', error);
      }
    };

    checkAuthentication(); // Call the function to check authentication status when component mounts

  
  
  }, []); // Empty dependency array ensures the effect runs only once when component mounts

 
  

    const handleLogOut = async () => {
        await AsyncStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
        navigation.navigate('Login');
    };
    
    // Function to close the modal and reset editedCampIndex
    const closeEditModal = () => {
      setEditModalVisible(false);

    };



    const updateBookingRecord = async(index) => { 

      //Check that Name and Phone number is still present 

      //Update Array with record  - We will not be updating the DB until after the payment 

      const updatedBookingRecord = {
        name: editedNameText,
        age: editedAgeText,
        allergies: editedAllergiesText,
        emergencyContactNumber: editedPhoneNumberText,
        additionalInfo: editedAdditionalInfoText

      };
    
      participantArray[index] = updatedBookingRecord;


      // Close the modal
      closeEditModal();

  }

    const [participantArray, setParticipantArray] = useState([]);
    const [participantCount, setParticipantCount] = useState(0);

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
            additionalInfo: additionalInfo
                    
        
          };

          setParticipantArray(prevArray => prevArray.concat(newParticpant));
          setParticipantCount(participantCount + 1);



          setName(''); // Clearing the text input by updating the state
          setAge(''); // Clearing the text input by updating the state
          setAllergies(''); // Clearing the text input by updating the state
          setPhoneNumber(''); // Clearing the text input by updating the state
          setAdditionalInfo(''); // Clearing the text input by updating the state
    
      }


    };


    // ------------- Modal Edit ------------------------------

    const [editedNameText, setEditedNameText] = useState(''); // Edited text for the camp being edited
    const [editedAgeText, setEditedAgeText] = useState(''); // Edited text for the camp being edited
    const [editedAllergiesText, setEditedAllergiesText] = useState(''); // Edited text for the camp being edited
    const [editedPhoneNumberText, setEditedPhoneNumberText] = useState(''); // Edited text for the camp being edited
    const [editedAdditionalInfoText, setEditedAdditionalInfoText] = useState(''); // Edited text for the camp being edited
    
    const editParticipantModal = async(index) => {
        // This to edit the participant to the array as we dont want to send the data to the DB until CHECKOUT 
        
        // Modal appears
        setEditModalVisible(true);

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

    const handleBookingCheckout = async() => {
      const apiCreateBooking = 'http://localhost:3000/api/campPayment';
      const jwtToken = await AsyncStorage.getItem('jwtToken');
  
        // Handle Stripe API and payment once the payment is confirm / made , then we will then Participant array and push the data to the DB 
        try {
         
          const finalAmount = parseInt(receivedPrice);

          if (finalAmount < 1) return Alert.alert("You cannot donate below 1 GBP");
          const response = await fetch(apiCreateBooking, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({ amount: finalAmount, bookingName: bookingName }),
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
        } catch (err) {
          console.error(err);
          Alert.alert("Payment failed!");
        }
    };


  return (
 
  <ScrollView>

   <StripeProvider publishableKey='pk_test_51OnkfED7nseNwvj8Zgtfn4YbMAQbVl2Y3yWn56QAF6rLJmAn6ez4Wyp24aLIEtzLLEs15N06P0FxI5w9I8jnTvaf00DjYAqVWL'>
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


    <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={addParticipant}>Submit Participant</Text>
    </TouchableOpacity>

{/* This should only appear if user enter at least on particpant */}
  <View>
    {/* Conditional rendering using a ternary operator */}
    {participantCount >= 1 ? (
      
      <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText} onPress={handleBookingCheckout}>Make Booking / Payment </Text>
      </TouchableOpacity>







    ) : (
      <View>
  
      </View>
    )}
  </View>
 
  

   
    </View>

    {/* This will only appear when 1 particpant is added to the array count  */}
   
   
   <View style={styles.container}>

   
 
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
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={() => editParticipantModal(index)}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={() => removeParticipant(index)}>Remove</Text>
            </TouchableOpacity>
          </View>
          </View>

      ))}

      </View>

   


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
          <View style={styles.fieldRow}>

            <TouchableOpacity style={styles.button}  onPress={() => updateBookingRecord(editedBookingRecordArray)}>
              <Text style={styles.buttonText}>Update Booking</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.fieldRow}>

            <TouchableOpacity style={styles.button}  onPress={closeEditModal}>
              <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>

          </View>

        </View>

        </View>  

      </View> 




    </Modal>
    </StripeProvider>
  </ScrollView>
  

  );
};

export default CreateBooking;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 20,
    margin: 20,
    width: 'auto',
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
    button: {
      backgroundColor: '#4CAF50',
      borderRadius: 4,
      padding: 10,
      marginBottom: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
});
