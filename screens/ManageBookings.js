import React, { useEffect,useState } from 'react';
import {ScrollView, StyleSheet, View, TextInput, Button, Text, TouchableOpacity, Modal } from 'react-native';
import validator from 'validator';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';




const ManageBookings = ({ navigation }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [campData, setCampData] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());



  const [date, setDate] = useState(new Date(1598051730000));
const [mode, setMode] = useState('date');
const [show, setShow] = useState(false);


const [startTime, setStartTime] = useState(new Date());
const [endTime, setEndTime] = useState(new Date());
const [showTimePicker, setShowTimePicker] = useState(false);

  
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
    
    handleCamps();
    
    
    }, []);
    
    // Empty dependency array ensures the effect runs only once when component mounts
//GET CAMPS || EVENTS 

const handleCamps = async () => {

    // Fetch all camps 

    const apiGetCamps = 'http://localhost:3000/api/camps';
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    
    try {
      const response = await fetch(apiGetCamps, {
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
      setCampData(data);


  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }


  };


  
  
  
  
  const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
  };
  
  const showDatepicker = () => {
      showMode('date');
  };
  
  const showTimepicker = () => {
      showMode('time');
  };
  //------------------------
  
// ------------- iOS Date Picker functions ---------------

const [startPickerVisible, setStartPickerVisible] = useState(false);
const [endPickerVisible, setEndPickerVisible] = useState(false);



  const showStartPicker = () => {
    setStartPickerVisible(true);
  };

  const showEndPicker = () => {
    setEndPickerVisible(true);
  };

  const handleStartChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);

  };

  const handleEndChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    
  };

  const onStartChange = (event, selectedTime) => {
    setShowTimePicker(false);
    const currentTime = selectedTime || startTime;
    setStartTime(currentTime);
  };
  
  const onEndChange = (event, selectedTime) => {
    setShowTimePicker(false);
    const currentTime = selectedTime || endTime;
    setEndTime(currentTime);
  };

// ---------------------------MODAL----------------------------- 

const [editedCampIndex, setEditedCampIndex] = useState(-1);
const [editedLocationText, setEditedLocationText] = useState(''); // Edited text for the camp being edited
const [editedPriceText, setEditedPrice] = useState(''); // Edited text for the camp being edited


    // Function to open the modal and set the index of the camp being edited
    const openEditModal = (index) => {
      setEditModalVisible(true);
      setEditedCampIndex(index);

     // PREFILL EDIT FORM 
      if (index !== -1) {
        // Set editedText to the location of the camp being edited
        setEditedLocationText(campData[index].location);
        setEditedPrice(campData[index].price);
        
        setStartDate(new Date(campData[index].startDate));
        setEndDate(new Date(campData[index].endDate));

        setStartTime(new Date(campData[index].startTime));
        setEndTime(new Date(campData[index].endTime));
      }

      setStartPickerVisible(true);
      setEndPickerVisible(true);
      setShow(true);
  
    };
  
    // Function to close the modal and reset editedCampIndex
    const closeEditModal = () => {
      setEditModalVisible(false);

    };

  



  const removeCamp = async (index) => {

    const jwtToken = await AsyncStorage.getItem('jwtToken');
    const id = campData[index]._id; // Assuming each camp has an '_id' property

    try {
      await fetch(`http://localhost:3000/api/camps/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
        },
      });
  
      // Remove the camp from the local state
      setCampData((prevData) => {
        const newData = [...prevData];
        newData.splice(index, 1);
        return newData;
      });
    } catch (error) {
      console.error('Error removing camp:', error);
    }
  };

  const updateCamp = async (index) => {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
  
    if (index !== -1) {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const camp = campData[index]; // get the camp object

      if(camp)
      {
        if (camp) {
          const id = camp._id; // get the id of the camp object

          try {
              const response = await fetch(`http://localhost:3000/api/updateCamp/${id}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${jwtToken}`,
                  },
                  body: JSON.stringify({
                      location: editedLocationText,
                      price: editedPriceText,
                      startDate: startDate,
                      endDate: endDate,
                      startTime: startTime,
                      endTime: endTime
                  })
              });

              // Check if the request was successful
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }

              // Update the camp in the local state
              setCampData((prevData) => {
                  const newData = [...prevData];
                  newData[index] = {
                      ...newData[index],
                      location: editedLocationText,
                      price: editedPriceText,
                      startDate: startDate,
                      endDate: endDate,
                      startTime: startTime,
                      endTime: endTime
                  };
                  return newData;
              });

              // Close the modal
              closeEditModal();
          } catch (error) {
              console.error('Error updating camp:', error);
              // Display an error message to the user
              // This could be done with a Toast, Alert, or some other UI component
              // You could also use state to set an error message that is displayed in the modal
          }
      }
        }
      }




    };


  

return (

    <ScrollView>
        {campData.map((camp, index) => (
        <View key={index} style={styles.container}>  
            <Text>{camp.campName} </Text>
            <Text>Location: {camp.location}</Text> 
    
            <Text>Duration: {new Date(camp.startDate).toLocaleDateString('en-GB')} - {new Date(camp.endDate).toLocaleDateString('en-GB')}</Text>


            <Text>Start Time: {new Date(camp.startTime).toLocaleTimeString()} - End Time: {new Date(camp.endTime).toLocaleTimeString()}</Text>
            <Text>Price: £{camp.price} </Text>
            <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={() => openEditModal(index)}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}  onPress={() => removeCamp(index)}>
            <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
        </View>
        ))}

{/* Modal  */}


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
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.textInput}
            value={editedLocationText}
            onChangeText={setEditedLocationText}
            placeholder='Enter here..'
          />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Start Date:</Text>
  
          {startPickerVisible && (
            
            <DateTimePicker
              testID="dateTimePickerStart"
              value={startDate}
              mode={'date'}
              display="default"
              onChange={handleStartChange}
         
            />
            
          )}
              
        </View>



        <View style={styles.fieldRow}>
          <Text style={styles.label}>End Date:</Text>
  
          {startPickerVisible && (
            
            <DateTimePicker
              testID="dateTimePickerStart"
              value={endDate}
              mode={'date'}
              display="default"
              onChange={handleEndChange}
         
            />
            
          )}
              
        </View>





        <View style={styles.fieldRow}>
        <Text style={styles.label}>Select a start time:</Text>
                  {show && (
                  <DateTimePicker
                  testID="dateTimePicker"
                  value={startTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={onStartChange}
                />
              )}
              
          </View>


          <View style={styles.fieldRow}>
            <Text style={styles.label}>Select a end time:</Text>
              {show && (
              <DateTimePicker
              testID="dateTimePicker"
              value={endTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onEndChange}
            />
          )}
          </View>

          <Text style={styles.label}>Price(£)</Text>
          <View>
            <TextInput
            style={styles.textInput}
            value={editedPriceText}
            onChangeText={setEditedPrice}
            placeholder='Enter here..'
          />
          </View>


          <View style={styles.fieldRow}>

            <TouchableOpacity style={styles.button}  onPress={() => updateCamp(editedCampIndex)}>
              <Text style={styles.buttonText}>Update Camp</Text>
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

    </ScrollView>





  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      // borderWidth: 2,
      // borderColor: '#ccc',
      // padding: 20,
      // margin: 20,
      width: '100%',
      justifyContent: 'center',
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
  


export default ManageBookings;