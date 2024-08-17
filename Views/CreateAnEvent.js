import React, { useEffect, useState } from 'react';

import { StyleSheet, View, Button, Text, Platform ,TextInput , SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';


import { Ionicons } from '@expo/vector-icons';

//Stripe imports
import { CardField, useStripe, StripeProvider, InitPaymentSheet , usePaymentSheet} from '@stripe/stripe-react-native';

const CreateEvent = ({navigation}) => {


  useEffect(() => {
    setStartPickerVisible(true);
    setEndPickerVisible(true);
    setShow(true);

 
  

    

  }, []);


  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  //Error Messages 
  const [eventNameErrorMessage, setEventNameErrorMessage] = useState('');
  const [locationErrorMessage, setLocationErrorMessage] = useState('');
  const [priceErrorMessage, setPriceErrorMessage] = useState('');


// ------------- iOS Date Picker functions ---------------

const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(new Date());
const [startPickerVisible, setStartPickerVisible] = useState(false);
const [endPickerVisible, setEndPickerVisible] = useState(false);

  const handleStartChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);

  };

  const handleEndChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    
  };

  const showStartPicker = () => {
    setStartPickerVisible(true);
  };

  const showEndPicker = () => {
    setEndPickerVisible(true);
  };

// -------------------------------------------------------- 


///--------- WEB  -------------


const [date, setDate] = useState(new Date(1598051730000));
const [mode, setMode] = useState('date');

const [show, setShow] = useState(false);


const [startTime, setStartTime] = useState(new Date());
const [endTime, setEndTime] = useState(new Date());
const [showTimePicker, setShowTimePicker] = useState(false);

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




useEffect(() => {
  const checkAuthentication = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      setIsLoggedIn(!!jwtToken);

      // Obtain and store UserID ? aysc or maybe a GET? then pass it to the POST
    
    
    } catch (error) {
      console.error('Error fetching JWT token:', error);
    }
  };

  checkAuthentication(); // Call the function to check authentication status when component mounts
}, []); // Empty dependency array ensures the effect runs only once when component mounts


  const [range, setRange] = React.useState({ startDate: undefined, endDate: undefined });

  const [open, setOpen] = React.useState(false);

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);
      setRange({ startDate, endDate });
    },
    [setOpen, setRange]
  );




  const handleSubmit = async () => {
    try {
      const apiCreateEvent = 'http://localhost:3000/api/createEvent';
      const jwtToken = await AsyncStorage.getItem('jwtToken');
  
      if (!jwtToken) {
        throw new Error('JWT token not found');
      }

      // Reset error messages
      setEventNameErrorMessage("");
      setLocationErrorMessage("");
      setPriceErrorMessage("");

      //Form Validation before User can Handle Submition
      
      //If eventName is blank
      if(eventName == "")
      {
        const errorMessage1 = "Please enter the event name";
        setEventNameErrorMessage(errorMessage1);
      }
      else if(location == "")
      {
        const errorMessage2 = "Please enter a location";
        setLocationErrorMessage(errorMessage2);
      }
      else if(price == "") 
      {
        const errorMessage3 = "Please enter a price";
        setPriceErrorMessage(errorMessage3);
      }
      else {

  
        const response = await fetch(apiCreateEvent, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ 
            eventName,
            location, 
            price,
            startDate,
            startTime,
            endDate,
            endTime,
            
          }),
        });
    
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log('Event Created', jsonResponse);
          navigation.navigate('Manage Bookings', { dataTrigger: true}); 
        } else {
          console.log('Error Status:', response.status);
          console.log('Error Message:', response.statusText);
          let errorMessage = 'Unknown error occurred.';
          try {
            const jsonResponse = await response.json();
            errorMessage = jsonResponse.message || jsonResponse.error || jsonResponse.errorMessage || errorMessage;
          } catch (error) {
            errorMessage = response.statusText || errorMessage;
          }
          console.log('Error Message from JSON:', errorMessage);
        }
      } 
    }catch (error) {
        console.error('Network Error:', error.message);
        // Handle the error here. For example, set an error message state
        setErrorMessage(error.message);
      }

      
  };

 


  return (

     <ScrollView>
      <View style = {styles.container2}>
        <View style={styles.container}>



        <View style={styles.contentPosition}>

        <View style={styles.containerCard}>
        
            <View style={styles.formContent}>
                <Text style={styles.headerText}>Event Name: </Text>
                  <TextInput
                      placeholder=" Enter the Event name here"
                      value={eventName}
                      onChangeText={setEventName} />
            </View>

            <View style={styles.formValidation}>
              <Text style={styles.validationText}>{eventNameErrorMessage}</Text>
            </View>


                <View style={styles.formContent}>
                 <Text style={styles.headerText}>Location: </Text>
                    <TextInput
                      placeholder=" Enter the Location here"
                      value={location}
                      onChangeText={setLocation} />
                </View>

            <View style={styles.formValidation}>
              <Text style={styles.validationText}>{locationErrorMessage}</Text>
            </View>
          

                <View style={styles.formContent}>
                <Text style={styles.headerText}>Enter a price : </Text>
                      <TextInput
                        placeholder=" £0.00"
                        value={price}
                        onChangeText={setPrice} />
                </View>

                                  
            <View style={styles.formValidation}>
              <Text style={styles.validationText}>{priceErrorMessage}</Text>
            </View>
              
    

                        {/* ios */}
                    
                        {Platform.OS === 'ios' && 
                            // <SafeAreaView style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                          
                            <SafeAreaView>
                             <View style={styles.formContent}>
                              <Text style={styles.headerText}>Select a start date:</Text>
                                  
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

                        
      
                              <View style={styles.formContent}>
                              <Text style={styles.headerText}>Select a start time:</Text>
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
               
                      <View style={styles.formContent}>
                      <Text style={styles.headerText}>Select an end time:</Text>      
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

                  
                
                          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                                <View style={styles.buttonContent}>
                                    <Text style={styles.buttonText}>Create </Text>
                                    <Ionicons name="book-outline" size={20} style={styles.icon} />
                                </View>
                          </TouchableOpacity>
                     
                    

               
          
              </SafeAreaView>
            }

            {/* Andriod */}
            {Platform.OS === 'android' &&
            <SafeAreaView style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
            <Button onPress={showDatepicker} title="Show date picker!" />
            <Button onPress={showTimepicker} title="Show time picker!" />
            <Text>selected: {date.toLocaleString()}</Text>




                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChange}
                      />
                    )}
                    </SafeAreaView>
                    }


                    


            </View>
                    
            </View>
            </View>
            </View>
 
    </ScrollView>
    
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
   
    width:'100%'
  }, 

  button: {
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 2,
    zIndex: 2, // Ensure dropdown is above other elements
    paddingVertical: 5, // Reduced padding
    paddingHorizontal: 10, // Reduced padding
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    alignItems: 'center',
    justifyContent: 'center',
    
    
  },


  headerText:{
    color: 'black',
    fontSize: 14,
    fontWeight:'bold'

  },

  contentPosition:{
    marginTop:100
  },
  containerCard: {
    borderWidth: 8,
    borderColor: '#ffffff',
    borderRadius: 30,
    padding: 10,
    margin: 0,
    width: 'auto',
    backgroundColor: '#ecf0ff',
  },  
  validationText: {
    fontSize: 12,
    marginBottom: 10,
    color: 'red',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Width of the container (adjust as needed)
    height: '10%', // Height of the container (adjust as needed)
    backgroundColor: '#00e3ae',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 150, // Adjust this value for the desired curvature
    borderBottomRightRadius: 150, // Adjust this value for the desired curvature

  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  containerTextInput:{
    flex: 1,
    marginTop:70,
    marginBottom:-30,
  },
  icon :{
    color: '#00e3ae',
  },
  container2:{
  
    flex: 1,
    width: '100%', // Width of the container (adjust as needed)
    height: '100%', // Height of the container (adjust as needed)
    backgroundColor: '#ecf0ff',
    alignItems: 'center',
    justifyContent: 'center',


  },
  
  DateSelectionContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    width:'100%'
  },

  fieldRow:{
    flexDirection: 'column', // Display items in a row
    alignItems: 'center', // Align items in the center of the row
    paddingHorizontal: 20,
    paddingVertical: 20,

    borderColor:"black",
    borderWidth:0.5
  }, 
  formContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },

  formValidation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },

 
});

export default CreateEvent;