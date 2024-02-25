import React, { useEffect, useState } from 'react';

import { StyleSheet, View, Button, Text, Platform ,TextInput , SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';


const CreateCamp = () => {

  
  useEffect(() => {
    setStartPickerVisible(true);
    setEndPickerVisible(true);
    setShow(true);
  }, []);

  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);



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
      const apiCreateCamp = 'http://localhost:3000/api/createCamp';
      const jwtToken = await AsyncStorage.getItem('jwtToken');
  
      if (!jwtToken) {
        throw new Error('JWT token not found');
      }
  
      const response = await fetch(apiCreateCamp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ 
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
        console.log('Camp Created', jsonResponse);
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
    } catch (error) {
      console.error('Network Error:', error.message);
      // Handle the error here. For example, set an error message state
      setErrorMessage(error.message);
    }
  };

  

  return (
    <View style = {styles.container}>



      <View style={styles.fieldRow}>
        <Text>Location:</Text>
        <TextInput
          placeholder=" Enter the Location here"
          value={location}
          onChangeText={setLocation} />
      </View>

      <View style={styles.fieldRow}>
          <Text>Enter a price * Per person:</Text>
          <TextInput
            placeholder="£0.00"
            value={price}
            onChangeText={setPrice} />
      </View>


      {/* Web  */}

          {Platform.OS === 'web' && 
          <SafeAreaProvider>
              <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                <Button title = "Pick a Date Range" onPress={() => setOpen(true)} uppercase={false} mode="outlined" />
                  
                
                <DatePickerModal
                  disableStatusBarPadding
                  locale="en"
                  mode="range"
                  visible={open}
                  onDismiss={onDismiss}
                  startDate={range.startDate}
                  endDate={range.endDate}
                  onConfirm={onConfirm}
                  startYear={2024}
                  endYear={2050} />
              </View>
            
            </SafeAreaProvider>
            }

            {/* ios */}
        
            {Platform.OS === 'ios' && 
                <SafeAreaView style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                  <Text>Select a start date:</Text>
                 
                  <View style={styles.fieldRow}>
                   
                      
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

                  <Text>Select a end date:</Text>
                  <View style={styles.fieldRow}>
                    {endPickerVisible && (
                      <DateTimePicker
                        testID="dateTimePickerEnd"
                        value={endDate}
                        mode={'date'}
                        display="default"
                        onChange={handleEndChange}
                      />
                    )}
                  </View>







           <Text>Select a start time:</Text>

           <View style={styles.fieldRow}>
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
           <Text>Select an end time:</Text>
          <View style={styles.fieldRow}>

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

    

  

<View style = {styles.container}>
      <View style= {styles.DateSelectionContainer}>

         
      <Text>Summary Event Details </Text>
      <Text>Start Date : {startDate.toLocaleDateString('en-GB')}</Text>
      <Text>End Date : {endDate.toLocaleDateString('en-GB')}</Text>
      <Text> Time : {new Date(startTime).toLocaleTimeString()} to {new Date(endTime).toLocaleTimeString()}</Text>
      <Text>Location: {location}</Text>
      <Text>Price per person: £{price}</Text>
    


    <View style={styles.fieldRow}>
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
            <Button
              title="Create Camp"
              onPress={handleSubmit} />
    </View>


    

    </View>

 

    
</View>
     
          
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


    
  );
};


const styles = StyleSheet.create({

  container: {
    flex: 1,
   
    width:'100%'
  },

  
  DateSelectionContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    width:'100%'
  },

  fieldRow:{
    flexDirection: 'row', // Display items in a row
    alignItems: 'center', // Align items in the center of the row
    paddingHorizontal: 20,
    paddingVertical: 10,

    borderColor:"black",
    borderWidth:0.5
  }, 
  
 
});

export default CreateCamp;