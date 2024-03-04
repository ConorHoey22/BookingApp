import React, { useEffect, useState } from 'react';
import { ScrollView,StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Modal } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const CreateBooking = ({navigation}) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [campData, setCampData] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [allergies, setAllergies] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');


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

    const addParticipant = async() => {
        // This to add the participant to the array as we dont want to send the data to the DB until CHECKOUT 

    }

    const editParticipant = async() => {
        // This to edit the participant to the array as we dont want to send the data to the DB until CHECKOUT 

    }

    const removeParticipant = async() => {
        // This to remove the participant to the array as we dont want to send the data to the DB until CHECKOUT 

    }

    const handleBookingCheckout = async() => {

        // Handle Stripe API and payment once the payment is confirm / made , then we will then Participant array and push the data to the DB 

    };


  return (
 
  <ScrollView>
   
    {/* Get Booking details */}
    <View style={styles.container}>
        <Text style={styles.label}>Enter the name of the participant: </Text>
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
        <Text style={styles.label}>Emergency Contact Number: </Text>
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
          <Text style={styles.buttonText} onPress={addParticipant}>Add Another Participant</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={addParticipant}>Submit Booking </Text>
    </TouchableOpacity>

    </View>
    <Text style={styles.label}>Participant Booking List:</Text>
    {/* Display Participant , Be able to Edit / Delete from booking  */}
    <View style={styles.container}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.label}>Age:</Text>
        <Text style={styles.label}>Allergies:</Text>
        <Text style={styles.label}>Emergency Contact Number:</Text>
        <Text style={styles.label}>Anything else you would like us to know:</Text>

    <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={editParticipant}>Edit</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={removeParticipant}>Remove</Text>
    </TouchableOpacity>
    </View>

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
